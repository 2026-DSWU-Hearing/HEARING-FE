import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import BottomNavigation from '@/layout/BottomNavigation';
import { NOTIFICATION_QUERY_KEY } from '@/pages/home/constants/notificationConstants';
import {
  isNotificationInfiniteData,
  mergeNotificationIntoCache,
} from '@/pages/home/utils/notificationCache';
import AppRouter from '@/routes/AppRouter';
import { getAccessToken } from '@/pages/login/utils/tokenStorage';
import { useToast } from '@/shared/components/toast/ToastContext';
import { useDetectionSocket } from '@/shared/hooks/useDetectionSocket';
import { useFcmTokenSync } from '@/shared/hooks/useFcmTokenSync';
import { useDetectionStore } from '@/shared/stores/useDetectionStore';
import '@/App.css';

import type { NotificationInfiniteDataTypes } from '@/pages/home/types/notificationTypes';

const App = () => {
  const { pathname } = useLocation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

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

      // 알림 목록을 한 번이라도 조회한 경우에만 실시간 이벤트를 병합한다.
      // 아직 생성되지 않은 캐시는 WS 이벤트 하나로 불완전하게 만들지 않는다.
      const notificationQueryState =
        queryClient.getQueryState<NotificationInfiniteDataTypes>(
          NOTIFICATION_QUERY_KEY,
        );
      if (!notificationQueryState) return;

      // 무한 조회가 시작할 때 캡처한 이전 pages로 WS 병합 결과를 덮어쓰지
      // 않도록 진행 중 요청을 취소한 뒤 최신 캐시에 이벤트를 합친다.
      void queryClient
        .cancelQueries({ queryKey: NOTIFICATION_QUERY_KEY, exact: true })
        .then(() => {
          const notificationCache =
            queryClient.getQueryData<NotificationInfiniteDataTypes>(
              NOTIFICATION_QUERY_KEY,
            );

          if (isNotificationInfiniteData(notificationCache)) {
            queryClient.setQueryData<NotificationInfiniteDataTypes>(
              NOTIFICATION_QUERY_KEY,
              (data) =>
                data ? mergeNotificationIntoCache(data, detection) : data,
            );
            return;
          }

          if (notificationCache) {
            // HMR이나 과거 구현에서 같은 키에 다른 캐시 구조가 남은 경우
            // 잘못된 데이터를 폐기하고 Infinite Query 첫 페이지부터 다시 받는다.
            void queryClient.resetQueries({
              queryKey: NOTIFICATION_QUERY_KEY,
              exact: true,
            });
            return;
          }

          // 최초 조회 중 이벤트가 도착해 아직 data가 없다면 서버 저장분을
          // 놓치지 않도록 활성 쿼리를 처음부터 다시 요청한다.
          void queryClient.invalidateQueries({
            queryKey: NOTIFICATION_QUERY_KEY,
            exact: true,
            refetchType: 'active',
          });
        });
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
};

export default App;
