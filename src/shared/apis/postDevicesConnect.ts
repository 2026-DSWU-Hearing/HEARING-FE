import type { DeviceResponseTypes } from '@/shared/types/deviceApiTypes';
import http from '@/shared/apis/axios';

/** 기기를 현재 계정에 연결 (POST /devices/connect, body 없음). */
export const postDevicesConnect = async (): Promise<DeviceResponseTypes> => {
  const response = await http.post<DeviceResponseTypes>('/devices/connect');

  return response.data;
};
