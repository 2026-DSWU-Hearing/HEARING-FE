import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavigation from '@/layout/TopNavigation';
import NotificationToggleBar from '@/pages/setting/components/NotificationToggleBar';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchPushEnabled } from '@/pages/setting/hooks/usePatchPushEnabled';

const NotificationSettingPage = () => {
  const navigate = useNavigate();

  const { data: user } = useGetUsers();
  const { mutateAsync: updatePushEnabled, isPending: isUpdatingPushEnabled } =
    usePatchPushEnabled();

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
      await updatePushEnabled({ push_enabled: isAppPushOn });
    }
    navigate(-1);
  };

  return (
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
  );
};

export default NotificationSettingPage;
