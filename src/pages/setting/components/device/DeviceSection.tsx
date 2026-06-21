import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import DeviceStatusGrid from '@/pages/setting/components/device/DeviceStatusGrid';
import { CONNECTION_STATUS } from '@/pages/setting/constants/connectionStatus';
import type { DeviceInfoTypes } from '@/pages/setting/types/deviceTypes';

/**
 * 나의 디바이스 섹션.
 * 섹션 제목(연결 해제하기) + 디바이스 카드(기기 이름 헤더 + 배터리·연결 상태)로 구성한다.
 */
const DeviceSection = () => {
  // TODO(api): GET /devices(가칭)로 기기 정보 조회 후 더미 데이터를 대체한다.
  const deviceInfo: DeviceInfoTypes = {
    name: 'ESP32',
    batteryLevel: 80,
    connectionStatus: CONNECTION_STATUS.CONNECTED,
  };

  const { name, batteryLevel, connectionStatus } = deviceInfo;

  const handleDisconnect = () => {
    // TODO(api): 디바이스 연결 해제 요청.
  };

  const handleEditClick = () => {
    // TODO(api): 기기 이름 변경 플로우(모달/입력 + PATCH) 연결.
  };

  return (
    <section className="flex flex-col gap-sm">
      <SettingSectionTitle
        title="나의 디바이스"
        actionLabel="연결 해제하기"
        onActionClick={handleDisconnect}
      />
      <SettingCard
        icon={faMicrochip}
        label="기기 이름"
        title={name}
        onEdit={handleEditClick}
      >
        <DeviceStatusGrid
          batteryLevel={batteryLevel}
          connectionStatus={connectionStatus}
        />
      </SettingCard>
    </section>
  );
};

export default DeviceSection;
