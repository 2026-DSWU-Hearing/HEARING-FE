import http from '@/shared/apis/axios';
import { soundsMock } from '@/pages/home/mocks/soundMock';
import type { GetSoundsResponseTypes } from '@/pages/home/types/soundTypes';
// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = false;

export const getSounds = async (): Promise<GetSoundsResponseTypes> => {
  if (IS_MOCK) {
    return soundsMock;
  }

  const response = await http.get<GetSoundsResponseTypes>('/api/v1/sounds');
  return response.data;
};
