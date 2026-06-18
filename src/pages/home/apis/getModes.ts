import http from '@/shared/apis/axios';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';
import { normalizeModeIconKey } from '@/shared/components/icons/modes/modeIconMap';

// 모드 목록 조회
export const getModes = async (): Promise<GetModesResponseTypes> => {
  const response = await http.get<GetModesResponseTypes>('/modes');
  return {
    modes: response.data.modes.map((mode) => ({
      ...mode,
      icon: normalizeModeIconKey(mode.icon) ?? mode.icon,
    })),
  };
};
