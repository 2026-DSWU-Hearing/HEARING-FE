import { useRoutes } from 'react-router-dom';

import { APP_ROUTES } from '@/routes/appRoutes';

const AppRouter = () => {
  return useRoutes(APP_ROUTES);
};

export default AppRouter;
