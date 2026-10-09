---
name: verify
description: Hear:ing 웹앱을 실제로 띄우고 브라우저로 구동해 변경이 동작하는지 확인한다. UI/플로우 변경을 검증할 때 사용.
---

# Hear:ing 검증 레시피

## 사전 조건

백엔드가 떠 있어야 한다. 프론트 단독으로는 로그인부터 막힌다.

```bash
curl -s -m 3 -o /dev/null -w "%{http_code}" http://localhost:8000/docs   # 200이어야 함
```

백엔드는 `~/Desktop/CODING/HEARING-BE`, DB는 docker 컨테이너 `hearing-be-postgres-1`.

## 개발 서버

```bash
npx vite --port 5173 > /tmp/vite.log 2>&1 &   # run_in_background 사용
sleep 5 && curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
```

**반드시 `localhost:5173`으로 접근할 것.** `--host 127.0.0.1`로 띄우거나 `127.0.0.1`로
접속하면 백엔드 CORS 화이트리스트(`http://localhost:5173`)에 걸려 모든 API가 실패한다.
브라우저는 `localhost`와 `127.0.0.1`을 다른 출처로 취급한다.

**504 (Outdated Optimize Dep)가 뜨면** Vite 사전번들 캐시가 낡은 것이다. 앱이 초기화되지
않아 클릭이 먹지 않는다. 서버를 죽이고 캐시를 지운 뒤 재시작한다.

```bash
PID=$(netstat -ano | grep ":5173.*LISTENING" | awk '{print $5}' | head -1)
[ -n "$PID" ] && taskkill //F //PID $PID
rm -rf node_modules/.vite
```

## 브라우저 구동 (Playwright)

프로젝트에 Playwright가 없다. 스크래치패드에 설치해서 쓴다.

```bash
cd "$SCRATCHPAD" && npm install playwright --no-save --silent
npx playwright install chromium
```

뷰포트는 모바일 PWA이므로 `{ width: 390, height: 844 }`.

요청/응답을 로깅하면 프론트가 실제로 뭘 보내는지 보여서 디버깅이 빠르다.

```js
page.on('request', (r) => { /* r.postData() 로 바디 확인 */ });
page.on('response', (r) => { /* r.status() */ });
page.on('console', (m) => { if (m.type() === 'error') log(m.text()); });
```

로그인은 **UI 버튼으로** 한다. localStorage에 토큰을 직접 넣으면 `setLoginType` 같은
부수효과를 건너뛰어 실제 경로와 달라진다. 응답을 기다려 성공을 확인하고 진행할 것 —
실패하면 이후 단계가 전부 무의미한 통과("로그인 화면에는 그 버튼이 없다")가 된다.

```js
await page.getByRole('button', { name: /게스트/ }).click();
const res = await page.waitForResponse((r) => r.url().includes('/auth/guest'));
if (!res.ok()) throw new Error('로그인 실패');
const token = await page.evaluate(() => localStorage.getItem('accessToken'));
```

무시해도 되는 콘솔 에러: `[GSI_LOGGER] The given origin is not allowed` — 구글 로그인
클라이언트 ID가 localhost를 허용하지 않아서 나며, 게스트 로그인과 무관하다.

## 게스트 계정의 함정

서버가 신규 계정마다 **"데모 디바이스"를 `is_connected: true`로 시딩**한다.
미등록 상태를 테스트하려면 로그인 후 그 기기를 먼저 삭제해야 한다.
`push_enabled`도 `true`로 시딩되고 `terms_agreed: true`라 온보딩을 건너뛴다.
(백엔드 수정 요청 진행 중 — 고쳐지면 이 절은 무의미해진다)

## 디바이스 등록 실패 (현재 정상)

프론트는 `nickname`만 보내는데 서버 `DeviceCreate`는 아직 `mac_address`를 required로 둔다.
→ **422가 나는 것이 현재 정상**이다. 백엔드가 optional로 배포하면 해결된다.
(모달이 유지되며 "기기 등록에 실패했습니다"가 표시되면 프론트는 제대로 동작하는 것)

DB 접근이 필요하면:

```bash
docker exec hearing-be-postgres-1 psql -U hearing -d hearing -c "SELECT id, nickname, user_id FROM devices;"
```

(DB 유저/DB명 모두 `hearing`. `postgres`가 아니다.)

## curl로 API 검증할 때

**Git Bash에서 한글이 든 JSON을 인라인으로 넘기지 말 것.** 따옴표가 깨져 FastAPI가
400 `"There was an error parsing the body"`를 뱉는다. 파일로 넘기면 정상 동작한다.

**400과 422를 반드시 구분할 것.** 400은 "바디 파싱 실패"(= 내 curl이 깨진 것),
422는 "파싱은 됐고 스키마 위반"(= 진짜 API 계약 문제)이다. 층위가 다르다.
한글 인용 깨짐으로 나온 400을 "필수 필드 누락"으로 오독해 잘못된 결론을 내린 적이 있다.
API 계약을 확인하려면 curl보다 **브라우저에서 실제 요청을 관찰**하는 편이 확실하다.

```bash
printf '{"nickname":"넥밴드","mac_address":"..."}' > body.json
curl -X POST http://localhost:8000/devices -H "Content-Type: application/json" \
  --data-binary "@body.json"
```

## 참고

- API 스펙: `docs/api-spec.md` / OpenAPI: `http://localhost:8000/openapi.json`
- 트러블슈팅 기록: `docs/reports/`
