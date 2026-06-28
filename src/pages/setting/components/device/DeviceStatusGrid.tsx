import { faBatteryFull, faWifi } from '@fortawesome/free-solid-svg-icons';

import DeviceStatusCard from '@/pages/setting/components/device/DeviceStatusCard';
import {
  CONNECTION_STATUS,
  CONNECTION_STATUS_LABEL,
} from '@/pages/setting/constants/connectionStatus';
import type { ConnectionStatusTypes } from '@/pages/setting/constants/connectionStatus';

interface DeviceStatusGridPropTypes {
  /** 배터리 잔량 (0~100). 정보 없음이면 null */
  batteryLevel: number | null;
  /** 연결 상태 코드값 */
  connectionStatus: ConnectionStatusTypes;
}

/**
 * 디바이스 카드 본문.
 * 배터리·연결 상태 칩을 2열로 나열한다.
 */
const DeviceStatusGrid = ({
  batteryLevel,
  connectionStatus,
}: DeviceStatusGridPropTypes) => {
  const isConnected = connectionStatus === CONNECTION_STATUS.CONNECTED;
  // 배터리 정보가 없으면 0%로 오해하지 않도록 placeholder를 표시한다.
  const batteryLabel = batteryLevel === null ? '-' : `${batteryLevel}%`;

  return (
    <div className="grid grid-cols-2 gap-sm">
      <DeviceStatusCard
        icon={faBatteryFull}
        label="배터리"
        value={batteryLabel}
      />
      <DeviceStatusCard
        icon={faWifi}
        label="연결 상태"
        value={CONNECTION_STATUS_LABEL[connectionStatus]}
        valueClassName={isConnected ? 'text-secondary' : 'text-disabled'}
      />
    </div>
  );
};

export default DeviceStatusGrid;
