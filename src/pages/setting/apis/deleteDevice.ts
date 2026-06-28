import http from '@/shared/apis/axios';

/** 기기 삭제 */
export const deleteDevice = async (deviceId: number): Promise<void> => {
  await http.delete(`/devices/${deviceId}`);
};
