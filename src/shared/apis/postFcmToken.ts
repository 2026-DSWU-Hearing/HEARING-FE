import http from '@/shared/apis/axios';

export const postFcmToken = async (fcmToken: string): Promise<void> => {
  await http.post('/users/me/fcm-token', { fcm_token: fcmToken });
};
