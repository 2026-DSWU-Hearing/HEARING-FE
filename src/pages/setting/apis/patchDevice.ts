import type {
  DeviceResponseTypes,
  UpdateDeviceRequestTypes,
} from '@/shared/types/deviceApiTypes';
import http from '@/shared/apis/axios';

/** 기기 정보(이름) 수정. */
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
