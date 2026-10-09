import { Navigate, Outlet } from 'react-router-dom';

import LoadingSpinner from '@/shared/components/LoadingSpinner';
import { useGetUsers } from '@/shared/hooks/useGetUsers';

const ONBOARDING_START_PATH = '/onboarding/nickname';

const TermsAgreedRoute = () => {
  const { data: user, isPending, isFetching, isError } = useGetUsers();

  const isTermsAgreed = user?.terms_agreed ?? false;
  const isCheckingAgreement = isPending || (isFetching && !isTermsAgreed);

  if (isError) return <Outlet />;

  if (isCheckingAgreement) {
    return (
      <div className="h-dvh">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isTermsAgreed) {
    return <Navigate to={ONBOARDING_START_PATH} replace />;
  }

  return <Outlet />;
};

export default TermsAgreedRoute;
