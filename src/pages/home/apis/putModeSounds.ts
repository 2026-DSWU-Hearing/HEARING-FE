import http from '@/shared/apis/axios';
import type { UpdateModeSoundsResponseTypes } from '@/pages/home/types/modeTypes';
import type { UpdateModeSoundsRequestTypes } from '@/pages/home/types/soundTypes';

// 모드에 담긴 소리 목록 전체 교체 — PUT /modes/{id}/sounds, 본문 { sound_ids }
export const putModeSounds = async (
  modeId: number,
  soundsData: UpdateModeSoundsRequestTypes,
): Promise<UpdateModeSoundsResponseTypes> => {
  const response = await http.put<UpdateModeSoundsResponseTypes>(
    `/modes/${modeId}/sounds`,
    soundsData,
  );

  return response.data;
};
