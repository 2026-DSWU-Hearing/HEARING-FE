import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';

import TermsAgreedRoute from '@/routes/TermsAgreedRoute';
import ProfileEditPage from '@/pages/setting/ProfileEditPage';
import { getUsers } from '@/shared/apis/getUsers';
import { queryClient as applicationQueryClient } from '@/shared/apis/queryClient';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import {
  createNetworkError,
  createServerError,
} from './fixtures/networkErrors';
import { USER_FIXTURE } from './fixtures/userFixture';

vi.mock('@/shared/apis/getUsers', () => ({ getUsers: vi.fn() }));
vi.mock('@/shared/components/LoadingSpinner', () => ({
  default: () => <div role="status">조회 중</div>,
}));

// 실제 하위 페이지처럼 라우트와 동일한 사용자 쿼리를 구독한다.
const UserPage = () => {
  const { data } = useGetUsers();
  return <div>페이지: {data?.nickname}</div>;
};

let queryClient: QueryClient;

const renderRoutes = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Routes>
          <Route element={<TermsAgreedRoute />}>
            <Route path="/" element={<UserPage />} />
          </Route>
          <Route
            path="/onboarding/nickname"
            element={<div>약관 동의 필요</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => {
  onlineManager.setOnline(true);
  queryClient = new QueryClient({
    defaultOptions: {
      ...applicationQueryClient.getDefaultOptions(),
      queries: {
        ...applicationQueryClient.getDefaultOptions().queries,
        gcTime: Infinity,
        retryDelay: 0,
      },
    },
  });
  vi.mocked(getUsers).mockReset();
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  onlineManager.setOnline(true);
});

describe('조회 실패와 복구', () => {
  it.each([
    ['네트워크 단절', createNetworkError(), 1],
    ['타임아웃', new AxiosError('timeout', 'ECONNABORTED'), 1],
    ['서버 오류', createServerError(500), 2],
    ['잘못된 요청', createServerError(400), 1],
  ])(
    '%s 후 로딩을 종료하고 하위 페이지 재마운트로 재요청하지 않는다',
    async (_name, error, requestCount) => {
      vi.mocked(getUsers).mockRejectedValue(error);
      renderRoutes();
      await screen.findByRole('alert');
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 80));
      });
      expect(getUsers).toHaveBeenCalledTimes(requestCount);
      expect(screen.queryByRole('status')).toBeNull();
      expect(screen.queryByText(/페이지:/)).toBeNull();
    },
  );

  it('오프라인에서 pending/paused로 남지 않고 오류를 보여 준다', async () => {
    onlineManager.setOnline(false);
    vi.mocked(getUsers).mockRejectedValue(createNetworkError());
    renderRoutes();
    await screen.findByRole('alert');
    expect(queryClient.getQueryState(['users', 'me'])?.fetchStatus).toBe(
      'idle',
    );
    expect(getUsers).toHaveBeenCalledTimes(1);
  });

  it('서버 복구 후 다시 시도하면 하위 페이지로 진입한다', async () => {
    vi.mocked(getUsers)
      .mockRejectedValueOnce(createNetworkError())
      .mockResolvedValue(USER_FIXTURE);
    renderRoutes();
    fireEvent.click(await screen.findByRole('button', { name: '다시 시도' }));
    await screen.findByText(`페이지: ${USER_FIXTURE.nickname}`);
    expect(getUsers).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('캐시된 약관 동의가 있으면 백그라운드 실패로 페이지를 제거하지 않는다', async () => {
    queryClient.setQueryData(['users', 'me'], USER_FIXTURE);
    vi.mocked(getUsers).mockRejectedValue(createNetworkError());
    renderRoutes();
    await act(async () => {
      await queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    });
    expect(screen.getByText(`페이지: ${USER_FIXTURE.nickname}`)).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('정상 응답이 미동의 상태이면 온보딩으로 이동한다', async () => {
    vi.mocked(getUsers).mockResolvedValue({
      ...USER_FIXTURE,
      terms_agreed: false,
    });
    renderRoutes();
    await screen.findByText('약관 동의 필요');
  });

  it('프로필 조회 실패 시 빈 폼을 노출하지 않고 저장을 막으며 재시도로 복구한다', async () => {
    vi.mocked(getUsers)
      .mockRejectedValueOnce(createNetworkError())
      .mockResolvedValue(USER_FIXTURE);
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ProfileEditPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    await screen.findByRole('alert');
    expect(screen.queryByPlaceholderText('닉네임을 입력해주세요')).toBeNull();
    expect(
      (screen.getByRole('button', { name: '완료' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: '다시 시도' }));
    await waitFor(() =>
      expect(screen.getByDisplayValue(USER_FIXTURE.nickname)).toBeTruthy(),
    );
    expect(
      (screen.getByRole('button', { name: '완료' }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });
});
