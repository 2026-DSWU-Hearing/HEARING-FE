import { useFcmToken } from '@/pages/setting/hooks/useFcmToken';
import NotificationSettingBar from '@/pages/setting/components/NotificationSettingBar';

const Setting = () => {
  const { handleRequestPermission } = useFcmToken();

  return (
    <div className="flex flex-col gap-3 p-4">
      <NotificationSettingBar />

      <button
        type="button"
        onClick={handleRequestPermission}
        className="rounded bg-neutral-800 px-4 py-2 text-white"
      >
        알림 권한 요청
      </button>
    </div>
  );
};

export default Setting;
