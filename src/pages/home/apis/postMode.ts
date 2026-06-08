import type {
  CreateModeRequestTypes,
  CreateModeResponseTypes,
} from '@/pages/home/types/modeTypes';
import http from '@/shared/apis/axios';
import { createModeMock } from '@/pages/home/mocks/modeMock';
import { normalizeModeIconKey } from '@/shared/components/icons/modes/modeIconMap';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = false;
// 모드 생성
export const postMode = async (
  modeData: CreateModeRequestTypes,
): Promise<CreateModeResponseTypes> => {
  if (IS_MOCK) {
    return {
      ...createModeMock,
      name: modeData.name,
      icon: modeData.icon,
      sounds: modeData.sounds,
    };
  }

  const response = await http.post<CreateModeResponseTypes>(
    '/api/v1/modes',
    modeData,
  );

  return {
    ...response.data,
    icon: normalizeModeIconKey(response.data.icon) ?? response.data.icon,
  };
};
