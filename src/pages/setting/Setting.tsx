import NotificationSettingBar from '@/pages/setting/components/NotificationSettingBar';
import Profile from '@/pages/setting/components/profile/Profile';
import DeviceSection from '@/pages/setting/components/device/DeviceSection';
import HapticSection from '@/pages/setting/components/device/HapticSection';
import LogoutButton from '@/pages/setting/components/LogoutButton';
import SettingHeader from './components/SettingHeader';

const Setting = () => {
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

      <LogoutButton />
    </div>
  );
};

export default Setting;
