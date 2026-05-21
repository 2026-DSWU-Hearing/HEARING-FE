import http from '@/shared/apis/axios';
import type { GetModesResponseTypes } from '@/pages/home/types/modeCardTypes';
import { modeMock } from '../mocks/modeMock';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = true;

export const getModes = async (): Promise<GetModesResponseTypes> => {
  if (IS_MOCK) {
    return modeMock;
  }

  const response = await http.get<GetModesResponseTypes>('/api/v1/modes');
  return response.data;
};
