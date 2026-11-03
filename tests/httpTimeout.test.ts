// @vitest-environment node
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import http from '@/shared/apis/axios';
import { queryClient as applicationQueryClient } from '@/shared/apis/queryClient';

let requestCount = 0;
const server = createServer(() => {
  requestCount += 1;
});

beforeAll(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
});

afterAll(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

it('응답하지 않는 HTTP 서버 요청을 실제 5초 타임아웃으로 종료한다', async () => {
  vi.stubGlobal('localStorage', { getItem: () => null });
  const { port } = server.address() as AddressInfo;
  const queryClient = new QueryClient({
    defaultOptions: applicationQueryClient.getDefaultOptions(),
  });
  try {
    await expect(
      queryClient.fetchQuery({
        queryKey: ['unresponsive-server'],
        queryFn: () =>
          http.get(`http://127.0.0.1:${port}/never-respond`, {
            adapter: 'http',
          }),
      }),
    ).rejects.toMatchObject({ code: 'ECONNABORTED' });
    expect(requestCount).toBe(1);
    expect(queryClient.getQueryState(['unresponsive-server'])?.status).toBe(
      'error',
    );
    expect(
      queryClient.getQueryState(['unresponsive-server'])?.fetchStatus,
    ).toBe('idle');
  } finally {
    queryClient.clear();
  }
}, 10000);

it('토큰 갱신 서버도 실제 5초 타임아웃 후 실패를 반환한다', async () => {
  const { port } = server.address() as AddressInfo;
  const previousRequestCount = requestCount;
  vi.stubEnv('VITE_APP_BASE_URL', `http://127.0.0.1:${port}`);
  vi.stubGlobal('localStorage', { getItem: () => 'test-refresh-token' });
  vi.resetModules();
  try {
    const { refreshAccessToken } = await import('@/shared/apis/axios');
    await expect(refreshAccessToken()).resolves.toBeNull();
    expect(requestCount).toBe(previousRequestCount + 1);
  } finally {
    vi.unstubAllEnvs();
  }
}, 10000);
