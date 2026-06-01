import http from '@/shared/apis/axios';
import type {
  CreateModeRequestTypes,
  CreateModeResponseTypes,
} from '@/pages/home/types/modeTypes';

// 모드 생성
export const postMode = async (
  modeData: CreateModeRequestTypes,
): Promise<CreateModeResponseTypes> => {
  const response = await http.post<CreateModeResponseTypes>('/modes', modeData);

  return response.data;
};
