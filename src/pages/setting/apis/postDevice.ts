import type {
  CreateDeviceRequestTypes,
  DeviceResponseTypes,
} from '@/pages/setting/types/deviceApiTypes';
import http from '@/shared/apis/axios';

/** 기기 등록 */
export const postDevice = async (
  deviceData: CreateDeviceRequestTypes,
): Promise<DeviceResponseTypes> => {
  const response = await http.post<DeviceResponseTypes>('/devices', deviceData);

  return response.data;
};
