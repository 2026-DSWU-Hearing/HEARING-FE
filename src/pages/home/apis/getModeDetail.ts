import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
import { normalizeModeIconKey } from '@/shared/components/icons/modes/modeIconMap';

// 모드 상세 조회
export const getModeDetail = async (
  modeId: number,
): Promise<GetModeDetailResponseTypes> => {
  const response = await http.get<GetModeDetailResponseTypes>(
    `/api/v1/modes/${modeId}`,
  );

  return {
    ...response.data,
    icon: normalizeModeIconKey(response.data.icon) ?? response.data.icon,
  };
};
