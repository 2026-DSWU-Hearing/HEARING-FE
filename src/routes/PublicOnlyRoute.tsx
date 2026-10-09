import { Navigate, Outlet } from 'react-router-dom';

import { getAccessToken } from '@/pages/login/utils/tokenStorage';

const HOME_PATH = '/';

const PublicOnlyRoute = () => {
  const accessToken = getAccessToken();

  if (accessToken) {
    return <Navigate to={HOME_PATH} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
