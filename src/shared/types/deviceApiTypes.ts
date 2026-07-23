// GET /devices, POST /devices/connect 응답 (DeviceResponse)
export interface DeviceResponseTypes {
  id: number;
  nickname: string;
  battery_level: number | null;
  is_connected: boolean;
  is_active_user: boolean;
  last_seen_at: string | null;
}

// POST /devices 요청 바디 (DeviceCreate). 이 타입은 이름 UI 후속 정리 전까지 유지

export interface CreateDeviceRequestTypes {
  nickname: string;
}

//PATCH /devices/{device_id} 요청 바디 (DeviceUpdate). 이름 UI 후속 정리 전까지 유지한다.
export interface UpdateDeviceRequestTypes {
  nickname?: string | null;
}
