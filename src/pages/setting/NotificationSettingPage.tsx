import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavigation from '@/layout/TopNavigation';
import NotificationToggleBar from '@/pages/setting/components/NotificationToggleBar';
import { NotificationToggleBarSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { NOTIFICATION_MESSAGE } from '@/pages/setting/constants/notificationMessages';
import AlertModal from '@/shared/components/AlertModal';
import { isNotificationSupported } from '@/shared/firebase/settingFCM';
import { useFcmToken } from '@/shared/hooks/useFcmToken';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchPushEnabled } from '@/pages/setting/hooks/usePatchPushEnabled';
import { usePatchEmergencyAlert } from '@/pages/setting/hooks/usePatchEmergencyAlert';

const NotificationSettingPage = () => {
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useGetUsers();
  const { mutateAsync: updatePushEnabled, isPending: isUpdatingPushEnabled } =
    usePatchPushEnabled();
  const {
    mutateAsync: updateEmergencyAlert,
    isPending: isUpdatingEmergencyAlert,
  } = usePatchEmergencyAlert();
  const { permission, handleRequestPermission } = useFcmToken();

  const [alertMessage, setAlertMessage] = useState('');

  // 사용자가 토글을 건드리기 전까지는 null이며, 이때 표시값은 서버 값을 그대로 따른다.
  // 서버 값을 로컬 state로 복사하면 조회 전 기본값(꺼짐)이 잠깐 노출되고,
  // 이후 서버 값이 갱신돼도 화면이 옛 값에 고정되므로 파생값으로 계산한다.
  const [pendingAppPushOn, setPendingAppPushOn] = useState<boolean | null>(
    null,
  );
  // 긴급 소리 알림도 같은 방식으로, 완료 버튼을 누르기 전까지는 대기 값으로만 둔다.
  const [pendingEmergencyAlertOn, setPendingEmergencyAlertOn] = useState<
    boolean | null
  >(null);

  const isSaving = isUpdatingPushEnabled || isUpdatingEmergencyAlert;

  // 브라우저 알림 권한이 없으면 서버 값과 무관하게 실제로는 푸시가 오지 않는다.
  // 서버의 push_enabled는 "받고 싶다는 의사"일 뿐이므로, 수신 가능 여부까지 함께 봐야
  // 토글이 실제 상태를 나타낸다. (게스트 계정은 push_enabled가 true로 시작하는데
  // 온보딩을 건너뛰어 권한을 물어본 적이 없어, 이 계산이 없으면 켜진 것처럼 보인다.)
  const hasNotificationPermission = permission === 'granted';
  const isAppPushOn =
    pendingAppPushOn ??
    ((user?.push_enabled && hasNotificationPermission) || false);

  // 서버 기본값이 true(펌웨어 기본값과 동일)이므로, 응답에 값이 없을 때도 켜짐으로 본다.
  const isEmergencyAlertOn =
    pendingEmergencyAlertOn ?? user?.emergency_alert_enabled ?? true;

  const handleAppPushToggle = () => {
    setPendingAppPushOn(!isAppPushOn);
  };

  const handleEmergencyAlertToggle = () => {
    setPendingEmergencyAlertOn(!isEmergencyAlertOn);
  };

  const handleDoneClick = async () => {
    if (isSaving || !user) {
      return;
    }

    // 사용자가 어떤 토글도 건드리지 않았다면 저장할 것이 없다.
    if (pendingAppPushOn === null && pendingEmergencyAlertOn === null) {
      navigate(-1);
      return;
    }

    // 켜는 경우에만 권한을 확인한다. 끄는 데는 권한이 필요 없다.
    // 토글은 의사일 뿐이므로, 실제 수신 가능 여부(토큰 발급 성공)로 저장값을 정한다.
    if (pendingAppPushOn && !(await requestPushPermission())) {
      return;
    }

    // 서버 값과 같아도 저장을 건너뛰지 않는다. 권한이 없어 꺼져 보이던 상태에서
    // 사용자가 켠 경우, 서버 값은 이미 true라 비교만으로는 변경을 감지할 수 없다.
    // (이때 필요한 것은 저장이 아니라 위의 권한 요청이며, PATCH는 멱등이라 무해하다.)
    // 두 설정은 서로 독립이므로 값이 바뀐 항목만 골라 함께 저장한다.
    const updateRequests: Promise<unknown>[] = [];
    if (pendingAppPushOn !== null && pendingAppPushOn !== user.push_enabled) {
      updateRequests.push(
        updatePushEnabled({ push_enabled: pendingAppPushOn }),
      );
    }
    if (
      pendingEmergencyAlertOn !== null &&
      pendingEmergencyAlertOn !== user.emergency_alert_enabled
    ) {
      updateRequests.push(
        updateEmergencyAlert({
          emergency_alert_enabled: pendingEmergencyAlertOn,
        }),
      );
    }

    // 저장에 실패하면 페이지에 머물러 다시 시도할 수 있게 한다.
    // 성공한 항목은 캐시가 갱신되므로, 재시도 시 위 비교에서 자동으로 제외된다.
    try {
      await Promise.all(updateRequests);
    } catch {
      setAlertMessage(NOTIFICATION_MESSAGE.SAVE_FAIL);
      return;
    }
    navigate(-1);
  };

  // 알림 권한을 요청하고 실제로 푸시를 받을 수 있게 됐는지 반환한다.
  // 실패하면 켤 수 없으므로 토글을 되돌리고 이유를 안내한다.
  const requestPushPermission = async () => {
    const fcmToken = await handleRequestPermission();
    if (fcmToken) {
      return true;
    }

    // 권한 거부는 설정에서 해결할 수 있지만, 그 외 실패(미지원 환경, 토큰 발급 오류)는
    // 사용자가 설정을 바꿔도 해결되지 않으므로 재시도를 안내한다.
    const isPermissionDenied =
      isNotificationSupported() && Notification.permission === 'denied';

    setPendingAppPushOn(false);
    setAlertMessage(
      isPermissionDenied
        ? NOTIFICATION_MESSAGE.PERMISSION_DENIED
        : NOTIFICATION_MESSAGE.TOKEN_ISSUE_FAIL,
    );
    return false;
  };

  return (
    <>
      <div className="flex flex-col">
        <TopNavigation
          title="알림 설정"
          rightText="완료"
          onRightClick={handleDoneClick}
          rightVariant="default"
          isRightDisabled={isSaving || isUserLoading}
        />

        <section className="flex flex-col gap-xs px-[1.34rem]">
          <h2 className="heading-base-semibold text-secondary">알림 종류</h2>

          {isUserLoading ? (
            <>
              <NotificationToggleBarSkeleton />
              <NotificationToggleBarSkeleton />
            </>
          ) : (
            <>
              <NotificationToggleBar
                title="앱 푸시"
                isOn={isAppPushOn}
                onToggle={handleAppPushToggle}
                description={
                  permission === 'denied'
                    ? NOTIFICATION_MESSAGE.PERMISSION_DENIED_HINT
                    : undefined
                }
              />
              <NotificationToggleBar
                title="긴급 소리 알림 받기"
                isOn={isEmergencyAlertOn}
                onToggle={handleEmergencyAlertToggle}
              />
            </>
          )}
        </section>
      </div>
      <AlertModal
        isOpen={Boolean(alertMessage)}
        message={alertMessage}
        onClose={() => setAlertMessage('')}
      />
    </>
  );
};

export default NotificationSettingPage;
