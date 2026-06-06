import http from '@/shared/apis/axios';
import type {
  UpdateModeRequestTypes,
  UpdateModeResponseTypes,
} from '@/pages/home/types/modeTypes';

// 모드 수정 (이름/아이콘) — 백엔드는 PATCH /modes/{id}
export const putMode = async (
  modeId: number,
  modeData: UpdateModeRequestTypes,
): Promise<UpdateModeResponseTypes> => {
  const response = await http.patch<UpdateModeResponseTypes>(
    `/modes/${modeId}`,
    modeData,
  );

  return response.data;
};
