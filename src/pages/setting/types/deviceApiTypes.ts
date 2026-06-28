/**
 * 넥밴드(ESP32) 기기 API 타입.
 * 서버 응답 스펙(snake_case)을 그대로 따른다.
 */

/** GET /devices, PATCH /devices/{device_id} 응답 (DeviceResponse) */
export interface DeviceResponseTypes {
  id: number;
  nickname: string;
  mac_address: string;
  battery_level: number | null;
  is_connected: boolean;
  last_seen_at: string | null;
}

/**
 * PATCH /devices/{device_id} 요청 바디 (DeviceUpdate).
 * 부분 수정이므로 모든 필드 선택적.
 * - 연결 해제: `{ is_connected: false }`
 * - 다시 연결: `{ is_connected: true }`
 */
export interface UpdateDeviceRequestTypes {
  nickname?: string | null;
  battery_level?: number | null;
  is_connected?: boolean | null;
}
