import { useFcmToken } from '@/pages/setting/hooks/useFcmToken';
import NotificationSettingBar from '@/pages/setting/components/NotificationSettingBar';
import Profile from '@/pages/setting/components/profile/Profile';
import DeviceSection from '@/pages/setting/components/device/DeviceSection';
import HapticSection from '@/pages/setting/components/device/HapticSection';
import SettingHeader from './components/SettingHeader';

const Setting = () => {
  const { handleRequestPermission } = useFcmToken();

  return (
    <div className="flex min-h-dvh flex-col px-[1rem] pb-[9.5rem]">
      <SettingHeader />
      <div className="flex flex-col gap-sm mb-lg">
        <Profile />
        <NotificationSettingBar />
      </div>

      <div className="flex flex-col gap-lg">
        <DeviceSection />
        <HapticSection />
      </div>

      <button
        type="button"
        onClick={handleRequestPermission}
        className="mt-2xl rounded bg-neutral-800 px-4 py-2 text-white"
      >
        알림 권한 요청
      </button>
    </div>
  );
};

export default Setting;
