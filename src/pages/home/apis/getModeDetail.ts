import http from '@/shared/apis/axios';
import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';

// 모드 상세 조회
export const getModeDetail = async (
  modeId: number,
): Promise<GetModeDetailResponseTypes> => {
  const response = await http.get<GetModeDetailResponseTypes>(
    `/modes/${modeId}`,
  );

  return response.data;
};
