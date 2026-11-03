import { Navigate, Outlet } from 'react-router-dom';
import { isAxiosError } from 'axios';

import LoadingSpinner from '@/shared/components/LoadingSpinner';
import QueryErrorState from '@/shared/components/QueryErrorState';
import { useGetUsers } from '@/shared/hooks/useGetUsers';

const ONBOARDING_START_PATH = '/onboarding/nickname';

const TermsAgreedRoute = () => {
  const {
    data: user,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUsers();
  const isAccessDenied =
    isAxiosError(error) &&
    (error.response?.status === 401 || error.response?.status === 403);

  // 이미 확인한 동의 정보가 있으면 백그라운드 조회 실패로 페이지를 제거하지 않는다.
  if (user?.terms_agreed && !isAccessDenied) return <Outlet />;

  if (isPending || isFetching) {
    return (
      <div className="h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    // 실패한 채 Outlet을 열면 하위 페이지가 같은 사용자 쿼리를 다시 시작해
    // 로딩 → 실패 → 마운트가 반복된다. 명시적인 재시도 전까지 오류 화면을 유지한다.
    return (
      <div className="flex min-h-dvh items-center justify-center pb-24">
        <QueryErrorState
          message="사용자 정보를 불러오지 못했습니다"
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return <Navigate to={ONBOARDING_START_PATH} replace />;
};

export default TermsAgreedRoute;
