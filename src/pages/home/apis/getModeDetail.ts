import type { GetModeDetailResponseTypes } from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
import { modeDetailMock } from '@/pages/home/mocks/modeMock';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = false;
// 모드 상세 조회
export const getModeDetail = async (
  modeId: number,
): Promise<GetModeDetailResponseTypes> => {
  if (IS_MOCK) {
    return {
      ...modeDetailMock,
      mode_id: modeId,
    };
  }

  const response = await http.get<GetModeDetailResponseTypes>(
    `/api/v1/modes/${modeId}`,
  );

  return response.data;
};
