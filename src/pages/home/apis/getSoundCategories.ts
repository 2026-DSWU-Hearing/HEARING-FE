import http from '@/shared/apis/axios';
import type { GetSoundCategoriesResponseTypes } from '@/pages/home/types/soundTypes';

// 소리 카테고리 목록 조회
export const getSoundCategories =
  async (): Promise<GetSoundCategoriesResponseTypes> => {
    const response =
      await http.get<GetSoundCategoriesResponseTypes>('/sounds/categories');

    return response.data;
  };
