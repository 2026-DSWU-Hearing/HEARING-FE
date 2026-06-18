import http from '@/shared/apis/axios';
import type {
  UpdateModeSoundsRequestTypes,
  UpdateModeSoundsResponseTypes,
} from '@/pages/home/types/soundTypes';

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
