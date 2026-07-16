import type { DeviceResponseTypes } from '@/shared/types/deviceApiTypes';
import http from '@/shared/apis/axios';

/** 기기 목록 조회 */
export const getDevices = async (): Promise<DeviceResponseTypes[]> => {
  const response = await http.get<DeviceResponseTypes[]>('/devices');

  return response.data;
};
