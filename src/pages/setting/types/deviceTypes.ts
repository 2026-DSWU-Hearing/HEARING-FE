import type { ConnectionStatusTypes } from '@/pages/setting/constants/connectionStatus';

/** 넥밴드(ESP32) 디바이스 정보. TODO(api): 실제 응답 스펙 확정 시 필드명을 맞춘다. */
export interface DeviceInfoTypes {
  /** 기기 이름 (예: ESP32) */
  name: string;
  /** 배터리 잔량 (0~100) */
  batteryLevel: number;
  /** 연결 상태 코드값 */
  connectionStatus: ConnectionStatusTypes;
}
