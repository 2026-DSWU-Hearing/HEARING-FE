import type {
  UpdateModeSoundActiveRequestTypes,
  UpdateModeSoundActiveResponseTypes,
} from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
// 모드에 담긴 소리 on off API
export const patchModeSoundActive = async (
  modeId: number,
  soundId: number,
  soundActiveData: UpdateModeSoundActiveRequestTypes,
): Promise<UpdateModeSoundActiveResponseTypes> => {
  const response = await http.patch<UpdateModeSoundActiveResponseTypes>(
    `/api/v1/modes/${modeId}/sounds/${soundId}`,
    soundActiveData,
  );

  return response.data;
};
