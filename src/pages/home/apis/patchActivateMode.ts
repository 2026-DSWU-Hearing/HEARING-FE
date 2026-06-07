import type { ActivateModeResponseTypes } from '@/pages/home/types/modeTypes';
import { activateModeMock } from '@/pages/home/mocks/modeMock';
import http from '@/shared/apis/axios';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = true;
// 모드 활성화
export const patchActivateMode = async (
  modeId: number,
): Promise<ActivateModeResponseTypes> => {
  if (IS_MOCK) {
    return {
      ...activateModeMock,
      mode_id: modeId,
      is_active: true,
    };
  }

  const response = await http.patch<ActivateModeResponseTypes>(
    `/api/v1/modes/${modeId}/activate`,
  );

  return response.data;
};
