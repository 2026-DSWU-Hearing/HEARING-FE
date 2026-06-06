import http from '@/shared/apis/axios';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';

// 모드 목록 조회
export const getModes = async (): Promise<GetModesResponseTypes> => {
  const response = await http.get<GetModesResponseTypes>('/modes');
  return response.data;
};
