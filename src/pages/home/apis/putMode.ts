import type {
  UpdateModeRequestTypes,
  UpdateModeResponseTypes,
} from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
import { updateModeMock } from '@/pages/home/mocks/modeMock';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = true;
// 모드 수정
export const putMode = async (
  modeId: number,
  modeData: UpdateModeRequestTypes,
): Promise<UpdateModeResponseTypes> => {
  if (IS_MOCK) {
    return {
      ...updateModeMock,
      mode_id: modeId,
      name: modeData.name,
      icon: modeData.icon,
      sounds: modeData.sounds,
    };
  }

  const response = await http.put<UpdateModeResponseTypes>(
    `/api/v1/modes/${modeId}`,
    modeData,
  );

  return response.data;
};
