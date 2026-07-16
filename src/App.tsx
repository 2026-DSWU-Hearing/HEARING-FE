import { useLocation } from 'react-router-dom';

import BottomNavigation from '@/layout/BottomNavigation';
import AppRouter from '@/routes/AppRouter';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';
import { useToast } from '@/shared/components/toast/ToastContext';
import { useDetectionSocket } from '@/shared/hooks/useDetectionSocket';
import { useFcmTokenSync } from '@/shared/hooks/useFcmTokenSync';
import { useDetectionStore } from '@/shared/stores/useDetectionStore';
import '@/App.css';

function App() {
  const { pathname } = useLocation();
  const { showToast } = useToast();

  // 로그인 성공 시 useGoogleAuth가 navigate('/')로 주소를 바꾸면 App이 리렌더되고,
  // 이때 토큰을 다시 읽어 useDetectionSocket에 넘겨 로그인 직후 WS 연결이 트리거된다.
  // (localStorage는 반응형이 아니라 라우트 변경을 신호로 삼는다.)
  const accessToken = getAccessToken();
  const pushDetection = useDetectionStore((state) => state.pushDetection);

  useFcmTokenSync();
  // 앱이 켜져 있을 때는 FCM 대신 WebSocket으로 감지 알림을 받는다(포그라운드 중복 방지).
  // 하나의 감지 이벤트로 토스트를 띄우고(전역), 스토어에도 넣는다(실시간 감지 페이지 목록용).
  useDetectionSocket({
    token: accessToken,
    onDetection: (detection) => {
      showToast({
        soundName: detection.sound_name,
        categoryName: detection.sound_category,
      });
      pushDetection(detection);
    },
  });

  // 모드쪽 설정 페이지, 설정 하위 서브페이지, 알림 페이지에서는 네비게이션 숨김
  // ('/setting' 메인은 '/setting/'에 걸리지 않아 탭바가 유지된다)
  // 알림 페이지는 TopNavigation으로 진입/뒤로가기 하는 서브 페이지라 탭바를 숨긴다
  // (어떤 탭도 active가 되지 않는 어정쩡한 상태를 방지).
  const hideNavigation =
    pathname.startsWith('/modes/') ||
    pathname.startsWith('/setting/') ||
    pathname.startsWith('/onboarding') ||
    pathname === '/notifications';

  return (
    <div className="app">
      <AppRouter />
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
}

export default App;
