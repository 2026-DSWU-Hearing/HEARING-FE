import http from '@/shared/apis/axios';

// 발급받은 FCM 토큰을 서버에 등록한다.
// 백엔드: POST /users/me/fcm-token, 바디 키는 snake_case(fcm_token)
export const postFcmToken = async (fcmToken: string): Promise<void> => {
  await http.post('/users/me/fcm-token', { fcm_token: fcmToken });
};
