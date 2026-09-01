import { loadEnv } from 'vite';
import type { Plugin, ProxyOptions } from 'vite';

// RTZR(VITO) 실시간 STT를 붙이기 위한 "목 백엔드" 플러그인.
//
// 왜 필요한가:
// 1) VITO 스트리밍 API는 WebSocket 인증을 Authorization 헤더로만 받는다.
//    브라우저 WebSocket 생성자는 헤더를 지정할 수 없어서 프론트에서 직접 붙을 수 없다.
// 2) client_secret을 프론트 번들(VITE_ 접두사 env)에 넣으면 그대로 노출된다.
//
// 그래서 dev 서버가 백엔드 흉내를 낸다.
//   - GET /api/mock/stt/token       : VITO 액세스 토큰을 서버에서 발급/캐싱한다(토큰 값은 응답하지 않는다).
//   - WS  /v1/transcribe:streaming  : 업그레이드 요청을 VITO로 중계하면서 Authorization 헤더를 붙인다.
//
// 실제 백엔드가 준비되면 이 플러그인을 지우고, 프론트의 STT_STREAM_ORIGIN만
// 백엔드 주소로 바꾸면 된다(나머지 프론트 코드는 그대로).

const VITO_AUTH_URL = 'https://openapi.vito.ai/v1/authenticate';
const VITO_WS_TARGET = 'wss://openapi.vito.ai';

// 프론트(sttConfig.ts)의 STT_STREAM_PATH와 반드시 같은 값이어야 한다.
// VITO의 실제 경로를 그대로 쓰는 이유: 경로를 바꾸면 ws 프록시에 rewrite가 필요한데,
// 같은 경로를 쓰면 rewrite 없이 그대로 흘려보낼 수 있어 설정이 단순하고 덜 깨진다.
const STT_STREAM_PATH = '/v1/transcribe:streaming';
const STT_TOKEN_PATH = '/api/mock/stt/token';

// 만료 직전 토큰을 재사용하다 401을 맞지 않도록 여유를 둔다.
const TOKEN_EXPIRY_MARGIN_MS = 60_000;

interface VitoAuthResponseTypes {
  access_token: string;
  // unix seconds
  expire_at: number;
}

interface CachedTokenTypes {
  accessToken: string;
  expiresAtMs: number;
}

// 모듈 스코프에 둬서 토큰 발급 미들웨어와 ws 프록시가 같은 값을 본다.
// ws 업그레이드 콜백은 동기라 그 안에서 토큰을 발급할 수 없다.
// 그래서 프론트는 소켓을 열기 전에 반드시 토큰 엔드포인트를 먼저 호출한다.
let cachedToken: CachedTokenTypes | null = null;

const isTokenUsable = (
  token: CachedTokenTypes | null,
): token is CachedTokenTypes =>
  token !== null && token.expiresAtMs - TOKEN_EXPIRY_MARGIN_MS > Date.now();

const issueAccessToken = async (
  clientId: string,
  clientSecret: string,
): Promise<CachedTokenTypes> => {
  const response = await fetch(VITO_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `RTZR 토큰 발급 실패: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as VitoAuthResponseTypes;

  return {
    accessToken: data.access_token,
    expiresAtMs: data.expire_at * 1000,
  };
};

// ws 업그레이드 요청이 VITO로 나가기 직전에 Authorization 헤더를 채운다.
const configureSttProxy: ProxyOptions['configure'] = (proxy) => {
  proxy.on('proxyReqWs', (proxyReq) => {
    if (!isTokenUsable(cachedToken)) {
      console.error(
        '[rtzr-mock] 유효한 토큰이 없습니다. 소켓 연결 전에 토큰 엔드포인트를 먼저 호출해야 합니다.',
      );
      proxyReq.destroy();
      return;
    }

    proxyReq.setHeader('Authorization', `Bearer ${cachedToken.accessToken}`);
  });

  proxy.on('error', (error) => {
    console.error('[rtzr-mock] STT 프록시 오류:', error.message);
  });
};

export const rtzrMockBackend = (): Plugin => {
  let clientId = '';
  let clientSecret = '';

  return {
    name: 'rtzr-mock-backend',
    // dev 서버 전용. 빌드 결과물에는 아무 영향이 없다.
    apply: 'serve',

    config: (_config, { mode }) => {
      // VITE_ 접두사가 없는 값은 번들에 포함되지 않는다. 시크릿은 여기서만 읽는다.
      const env = loadEnv(mode, process.cwd(), '');
      clientId = env.RTZR_CLIENT_ID ?? '';
      clientSecret = env.RTZR_CLIENT_SECRET ?? '';

      return {
        server: {
          proxy: {
            [STT_STREAM_PATH]: {
              target: VITO_WS_TARGET,
              ws: true,
              changeOrigin: true,
              configure: configureSttProxy,
            },
          },
        },
      };
    },

    configureServer: (server) => {
      server.middlewares.use(STT_TOKEN_PATH, async (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');

        if (!clientId || !clientSecret) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              message:
                '.env.local에 RTZR_CLIENT_ID / RTZR_CLIENT_SECRET을 설정해주세요.',
            }),
          );
          return;
        }

        try {
          if (!isTokenUsable(cachedToken)) {
            cachedToken = await issueAccessToken(clientId, clientSecret);
          }

          res.statusCode = 200;
          // 토큰 값 자체는 브라우저로 내려보내지 않는다. 준비됐다는 사실만 알려준다.
          res.end(JSON.stringify({ expiresAtMs: cachedToken.expiresAtMs }));
        } catch (error) {
          cachedToken = null;
          res.statusCode = 502;
          res.end(
            JSON.stringify({
              message:
                error instanceof Error ? error.message : 'RTZR 토큰 발급 실패',
            }),
          );
        }
      });
    },
  };
};
