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
    `/api/v1/modes/${modeId}/sounds`,
    soundsData,
  );

  return response.data;
};
