import type {
  UpdateModeRequestTypes,
  UpdateModeResponseTypes,
} from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
import { normalizeModeIconKey } from '@/shared/components/icons/modes/modeIconMap';

// 모드 수정
export const putMode = async (
  modeId: number,
  modeData: UpdateModeRequestTypes,
): Promise<UpdateModeResponseTypes> => {
  const response = await http.put<UpdateModeResponseTypes>(
    `/api/v1/modes/${modeId}`,
    modeData,
  );

  return {
    ...response.data,
    icon: normalizeModeIconKey(response.data.icon) ?? response.data.icon,
  };
};
