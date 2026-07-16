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
 * POST /devices 요청 바디 (DeviceCreate).
 *
 * mac_address는 보내지 않는다. 웹(PWA)은 보안상 BLE 페어링으로도 기기의 MAC을 얻을 수
 * 없어 프론트가 아는 값이 아니다. MAC은 ESP32가 서버에 접속하며 직접 알린다.
 */
export interface CreateDeviceRequestTypes {
  nickname: string;
}

/**
 * PATCH /devices/{device_id} 요청 바디 (DeviceUpdate).
 * 부분 수정이므로 모든 필드 선택적.
 *
 * 서버 스펙에는 battery_level·is_connected도 있지만 프론트에서는 다루지 않는다.
 * 두 값의 진실 원천은 하드웨어(ESP32)이며, 프론트가 쓰면 실제와 다른 상태를
 * 서버에 남길 수 있다. 오용을 막기 위해 타입에서 제외한다.
 */
export interface UpdateDeviceRequestTypes {
  nickname?: string | null;
}
