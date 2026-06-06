import http from '@/shared/apis/axios';
import type { GetSoundsResponseTypes } from '@/pages/home/types/soundTypes';

// 선택 가능한 전체 소리 목록 조회
export const getSounds = async (): Promise<GetSoundsResponseTypes> => {
  const response = await http.get<GetSoundsResponseTypes>('/sounds');
  return response.data;
};
