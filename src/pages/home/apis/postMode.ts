import type {
  CreateModeRequestTypes,
  CreateModeResponseTypes,
} from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
import { normalizeModeIconKey } from '@/shared/components/icons/modes/modeIconMap';

// 모드 생성
export const postMode = async (
  modeData: CreateModeRequestTypes,
): Promise<CreateModeResponseTypes> => {
  const response = await http.post<CreateModeResponseTypes>('/modes', modeData);

  return {
    ...response.data,
    icon: normalizeModeIconKey(response.data.icon) ?? response.data.icon,
  };
};
