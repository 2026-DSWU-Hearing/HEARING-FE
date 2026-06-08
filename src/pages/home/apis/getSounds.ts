import http from '@/shared/apis/axios';
import type { GetSoundsResponseTypes } from '@/pages/home/types/soundTypes';

export const getSounds = async (): Promise<GetSoundsResponseTypes> => {
  const response = await http.get<GetSoundsResponseTypes>('/api/v1/sounds');
  return response.data;
};
