import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavigation from '@/layout/TopNavigation';
import NotificationToggleBar from '@/pages/setting/components/NotificationToggleBar';
import { NOTIFICATION_MESSAGE } from '@/pages/setting/constants/notificationMessages';
import AlertModal from '@/shared/components/AlertModal';
import { isNotificationSupported } from '@/shared/firebase/settingFCM';
import { useFcmToken } from '@/shared/hooks/useFcmToken';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchPushEnabled } from '@/pages/setting/hooks/usePatchPushEnabled';

const NotificationSettingPage = () => {
  const navigate = useNavigate();

  const { data: user } = useGetUsers();
  const { mutateAsync: updatePushEnabled, isPending: isUpdatingPushEnabled } =
    usePatchPushEnabled();
  const { handleRequestPermission } = useFcmToken();

  const [alertMessage, setAlertMessage] = useState('');

  // 토글은 완료 버튼을 누르기 전까지 로컬 상태로 들고 있다가 한 번에 저장한다.
  const [isAppPushOn, setIsAppPushOn] = useState(false);
  // 긴급 알림 강한 진동은 API 미정이라 로컬 상태로만 관리한다.
  const [isEmergencyStrongVibrationOn, setIsEmergencyStrongVibrationOn] =
    useState(false);

  // 조회한 서버 값으로 앱 푸시 토글 초기값을 한 번만 채운다(토글 중 덮어쓰기 방지).
  const isInitialized = useRef(false);
  useEffect(() => {
    if (isInitialized.current || !user) {
      return;
    }

    setIsAppPushOn(user.push_enabled);
    isInitialized.current = true;
  }, [user]);

  const handleAppPushToggle = () => {
    setIsAppPushOn((prev) => !prev);
  };

  const handleEmergencyVibrationToggle = () => {
    setIsEmergencyStrongVibrationOn((prev) => !prev);
    // TODO(api): 긴급 알림 강한 진동 on/off API 연동
  };

  const handleDoneClick = async () => {
    if (isUpdatingPushEnabled) {
      return;
    }

    // 값이 바뀐 경우에만 저장 요청한다.
    if (user && isAppPushOn !== user.push_enabled) {
      // 켜는 경우에만 권한을 확인한다. 끄는 데는 권한이 필요 없다.
      // 토글은 의사일 뿐이므로, 실제 수신 가능 여부(토큰 발급 성공)로 저장값을 정한다.
      if (isAppPushOn && !(await requestPushPermission())) {
        return;
      }

      await updatePushEnabled({ push_enabled: isAppPushOn });
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

    setIsAppPushOn(false);
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
          isRightDisabled={isUpdatingPushEnabled}
        />

        <section className="flex flex-col gap-xs px-[1.34rem]">
          <h2 className="heading-base-semibold text-secondary">알림 종류</h2>

          <NotificationToggleBar
            title="앱 푸시"
            isOn={isAppPushOn}
            onToggle={handleAppPushToggle}
          />
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
