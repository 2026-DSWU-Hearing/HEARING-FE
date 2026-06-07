import http from '@/shared/apis/axios';
import { modeMock } from '@/pages/home/mocks/modeMock';
import type { GetModesResponseTypes } from '@/pages/home/types/modeTypes';
// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = false;
// 모드 목록 조회
export const getModes = async (): Promise<GetModesResponseTypes> => {
  if (IS_MOCK) {
    return modeMock;
  }

  const response = await http.get<GetModesResponseTypes>('/api/v1/modes');
  return response.data;
};
