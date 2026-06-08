import type { ActivateModeResponseTypes } from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';

// 모드 활성화
export const patchActivateMode = async (
  modeId: number,
): Promise<ActivateModeResponseTypes> => {
  const response = await http.patch<ActivateModeResponseTypes>(
    `/api/v1/modes/${modeId}/activate`,
  );

  return response.data;
};
