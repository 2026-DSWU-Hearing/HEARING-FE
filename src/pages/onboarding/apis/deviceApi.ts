import http from '@/shared/apis/axios';

import type { DeviceTypes } from '@/pages/onboarding/types/deviceTypes';

export const getDevices = async (): Promise<DeviceTypes[]> => {
  const response = await http.get<DeviceTypes[]>('/devices');

  return response.data;
};
