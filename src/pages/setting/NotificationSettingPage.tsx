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

const NotificationSettingPage = () => {
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useGetUsers();
  const { mutateAsync: updatePushEnabled, isPending: isUpdatingPushEnabled } =
    usePatchPushEnabled();
  const { permission, handleRequestPermission } = useFcmToken();

  const [alertMessage, setAlertMessage] = useState('');

  // 사용자가 토글을 건드리기 전까지는 null이며, 이때 표시값은 서버 값을 그대로 따른다.
  // 서버 값을 로컬 state로 복사하면 조회 전 기본값(꺼짐)이 잠깐 노출되고,
  // 이후 서버 값이 갱신돼도 화면이 옛 값에 고정되므로 파생값으로 계산한다.
  const [pendingAppPushOn, setPendingAppPushOn] = useState<boolean | null>(null);
  // 긴급 알림 강한 진동은 API 미정이라 로컬 상태로만 관리한다.
  const [isEmergencyStrongVibrationOn, setIsEmergencyStrongVibrationOn] =
    useState(false);

  // 브라우저 알림 권한이 없으면 서버 값과 무관하게 실제로는 푸시가 오지 않는다.
  // 서버의 push_enabled는 "받고 싶다는 의사"일 뿐이므로, 수신 가능 여부까지 함께 봐야
  // 토글이 실제 상태를 나타낸다. (게스트 계정은 push_enabled가 true로 시작하는데
  // 온보딩을 건너뛰어 권한을 물어본 적이 없어, 이 계산이 없으면 켜진 것처럼 보인다.)
  const hasNotificationPermission = permission === 'granted';
  const isAppPushOn =
    pendingAppPushOn ?? ((user?.push_enabled && hasNotificationPermission) || false);

  const handleAppPushToggle = () => {
    setPendingAppPushOn(!isAppPushOn);
  };

  const handleEmergencyVibrationToggle = () => {
    setIsEmergencyStrongVibrationOn((prev) => !prev);
    // TODO(api): 긴급 알림 강한 진동 on/off API 연동
  };

  const handleDoneClick = async () => {
    if (isUpdatingPushEnabled || !user) {
      return;
    }

    // 사용자가 토글을 건드리지 않았다면 저장할 것이 없다.
    if (pendingAppPushOn === null) {
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
    if (pendingAppPushOn !== user.push_enabled) {
      await updatePushEnabled({ push_enabled: pendingAppPushOn });
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
          isRightDisabled={isUpdatingPushEnabled || isUserLoading}
        />

        <section className="flex flex-col gap-xs px-[1.34rem]">
          <h2 className="heading-base-semibold text-secondary">알림 종류</h2>

          {isUserLoading ? (
            <NotificationToggleBarSkeleton />
          ) : (
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
          )}
          <NotificationToggleBar
            title="긴급 알림만 세게 진동 울리기"
            isOn={isEmergencyStrongVibrationOn}
            onToggle={handleEmergencyVibrationToggle}
          />
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
