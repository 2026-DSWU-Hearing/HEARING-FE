import http from '@/shared/apis/axios';
import type { ActivateModeResponseTypes } from '@/pages/home/types/modeTypes';

// 모드 활성화 — 백엔드는 POST /modes/{id}/activate
export const patchActivateMode = async (
  modeId: number,
): Promise<ActivateModeResponseTypes> => {
  const response = await http.post<ActivateModeResponseTypes>(
    `/modes/${modeId}/activate`,
  );

  return response.data;
};
