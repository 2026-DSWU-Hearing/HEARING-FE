import http from '@/shared/apis/axios';

/**
 * 기기 연결 해제 (DELETE /devices/{deviceId}).
 * 기기 자체를 지우는 것이 아니라 현재 계정의 연결을 끊는 의미다.
 * 현재 계정이 활성 사용자가 아니어도 성공으로 응답한다.
 */
export const deleteDevice = async (deviceId: number): Promise<void> => {
  await http.delete(`/devices/${deviceId}`);
};
