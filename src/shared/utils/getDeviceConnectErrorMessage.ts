import { isAxiosError } from 'axios';

import { DEVICE_MESSAGE } from '@/shared/constants/deviceMessages';

/**
 * POST /devices/connect 실패 원인을 사용자 안내 문구로 바꾼다.
 * 서버는 "기기가 접속해 있지 않음"을 409로 구분해 주므로, 그 경우에만
 * 전원·Wi-Fi 안내를 띄우고 나머지(5xx·타임아웃 등)는 요청 실패로 안내한다.
 */
export const getDeviceConnectErrorMessage = (error: unknown): string => {
  if (isAxiosError(error) && error.response?.status === 409) {
    return DEVICE_MESSAGE.CONNECT_FAILED;
  }

  return DEVICE_MESSAGE.CONNECT_REQUEST_FAILED;
};
