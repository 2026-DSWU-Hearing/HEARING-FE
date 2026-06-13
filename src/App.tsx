import { useLocation } from 'react-router-dom';

import BottomNavigation from '@/layout/BottomNavigation';
import AppRouter from '@/routes/AppRouter';
import { useForegroundNotification } from '@/shared/hooks/useForegroundNotification';
import '@/App.css';

function App() {
  const { pathname } = useLocation();
  useForegroundNotification();

  // 모드쪽 설정 페이지에서는 네비게이션 숨김
  const hideNavigation = pathname.startsWith('/modes/');

  return (
    <div className="app">
      <AppRouter />
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
}

export default App;
