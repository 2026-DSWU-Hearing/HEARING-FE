import { useLocation } from 'react-router-dom';

import BottomNavigation from '@/layout/BottomNavigation';
import AppRouter from '@/routes/AppRouter';
import { useToast } from '@/shared/components/toast/ToastContext';
import { useDetectionSocket } from '@/shared/hooks/useDetectionSocket';
import { useFcmTokenSync } from '@/shared/hooks/useFcmTokenSync';
import '@/App.css';

function App() {
  const { pathname } = useLocation();
  const { showToast } = useToast();

  useFcmTokenSync();
  // 앱이 켜져 있을 때는 FCM 대신 WebSocket으로 감지 알림을 받아 인앱 토스트로 띄운다.
  // (FCM 포그라운드 알림과 중복되지 않도록 백엔드가 앱 활성 시 WS로만 보낸다.)
  useDetectionSocket({
    onDetection: ({ sound_name, sound_category }) =>
      showToast(`${sound_name} (${sound_category}) 감지됨`),
  });

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
