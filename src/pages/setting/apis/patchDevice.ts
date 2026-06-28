import type {
  DeviceResponseTypes,
  UpdateDeviceRequestTypes,
} from '@/pages/setting/types/deviceApiTypes';
import http from '@/shared/apis/axios';

/**
 * 기기 정보 수정.
 * 연결 해제는 `{ is_connected: false }`, 다시 연결은 `{ is_connected: true }`.
 */
export const patchDevice = async (
  deviceId: number,
  deviceData: UpdateDeviceRequestTypes,
): Promise<DeviceResponseTypes> => {
  const response = await http.patch<DeviceResponseTypes>(
    `/devices/${deviceId}`,
    deviceData,
  );

  return response.data;
};
