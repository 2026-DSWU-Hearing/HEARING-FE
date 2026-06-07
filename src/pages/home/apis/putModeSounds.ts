import http from '@/shared/apis/axios';
import { updateModeSoundsMock } from '@/pages/home/mocks/soundMock';
import type {
  UpdateModeSoundsRequestTypes,
  UpdateModeSoundsResponseTypes,
} from '@/pages/home/types/soundTypes';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = false;

export const putModeSounds = async (
  modeId: number,
  soundsData: UpdateModeSoundsRequestTypes,
): Promise<UpdateModeSoundsResponseTypes> => {
  if (IS_MOCK) {
    return {
      ...updateModeSoundsMock,
      mode_id: modeId,
      sounds: soundsData.sounds,
    };
  }

  const response = await http.put<UpdateModeSoundsResponseTypes>(
    `/api/v1/modes/${modeId}/sounds`,
    soundsData,
  );

  return response.data;
};
