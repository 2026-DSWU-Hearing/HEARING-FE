import { faBatteryFull, faWifi } from '@fortawesome/free-solid-svg-icons';

import DeviceStatusCard from '@/pages/setting/components/device/DeviceStatusCard';
import {
  CONNECTION_STATUS,
  CONNECTION_STATUS_LABEL,
} from '@/pages/setting/constants/connectionStatus';
import type { ConnectionStatusTypes } from '@/pages/setting/constants/connectionStatus';

interface DeviceStatusGridPropTypes {
  /** 배터리 잔량 (0~100) */
  batteryLevel: number;
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

  return (
    <div className="grid grid-cols-2 gap-sm">
      <DeviceStatusCard
        icon={faBatteryFull}
        label="배터리"
        value={`${batteryLevel}%`}
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
