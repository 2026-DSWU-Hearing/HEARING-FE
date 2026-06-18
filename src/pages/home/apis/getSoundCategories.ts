import http from '@/shared/apis/axios';
import type { GetSoundCategoriesResponseTypes } from '@/pages/home/types/soundTypes';

export const getSoundCategories =
  async (): Promise<GetSoundCategoriesResponseTypes> => {
    const response =
      await http.get<GetSoundCategoriesResponseTypes>('/sounds/categories');

    return response.data;
  };
