import http from '@/shared/apis/axios';
import { soundCategoriesMock } from '@/pages/home/mocks/soundMock';
import type { GetSoundCategoriesResponseTypes } from '@/pages/home/types/soundTypes';

// 나중에 실제 서버랑 연동 시 false로 설정하면 됨 - 현재 mock 데이터 보여주는 용도
const IS_MOCK = false;

export const getSoundCategories =
  async (): Promise<GetSoundCategoriesResponseTypes> => {
    if (IS_MOCK) {
      return soundCategoriesMock;
    }

    const response = await http.get<GetSoundCategoriesResponseTypes>(
      '/api/v1/sounds/categories',
    );

    return response.data;
  };
