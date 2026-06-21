import { useLocation } from 'react-router-dom';

import BottomNavigation from '@/layout/BottomNavigation';
import AppRouter from '@/routes/AppRouter';
import { useFcmTokenSync } from '@/shared/hooks/useFcmTokenSync';
import { useForegroundNotification } from '@/shared/hooks/useForegroundNotification';
import '@/App.css';

function App() {
  const { pathname } = useLocation();
  useFcmTokenSync();
  useForegroundNotification();

  // 모드쪽 설정 페이지와 설정 하위 서브페이지에서는 네비게이션 숨김
  // ('/setting' 메인은 '/setting/'에 걸리지 않아 탭바가 유지된다)
  const hideNavigation =
    pathname.startsWith('/modes/') || pathname.startsWith('/setting/');

  return (
    <div className="app">
      <AppRouter />
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
}

export default App;
