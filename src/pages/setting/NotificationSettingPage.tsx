import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavigation from '@/layout/TopNavigation';
import NotificationToggleBar from '@/pages/setting/components/NotificationToggleBar';

const NotificationSettingPage = () => {
  const navigate = useNavigate();

  // 설정 API 연동 전까지는 로컬 상태로만 토글을 관리한다.
  const [isAppPushOn, setIsAppPushOn] = useState(false);
  const [isEmergencyStrongVibrationOn, setIsEmergencyStrongVibrationOn] =
    useState(false);

  const handleAppPushToggle = () => {
    setIsAppPushOn((prev) => !prev);
    // TODO(api): 앱 푸시 알림 on/off API 연동
  };

  const handleEmergencyVibrationToggle = () => {
    setIsEmergencyStrongVibrationOn((prev) => !prev);
    // TODO(api): 긴급 알림 강한 진동 on/off API 연동
  };

  const handleDoneClick = () => {
    // TODO(api): 변경된 알림 설정 저장 API 연동
    navigate(-1);
  };

  return (
    <div className="flex flex-col">
      <TopNavigation
        title="알림 설정"
        rightText="완료"
        onRightClick={handleDoneClick}
        rightVariant="default"
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
