import type {
  GetSoundCategoriesResponseTypes,
  GetSoundsResponseTypes,
  UpdateModeSoundsResponseTypes,
} from '@/pages/home/types/soundTypes';

export const soundsMock: GetSoundsResponseTypes = {
  sounds: [
    {
      sound_id: 1,
      name: '자동차 경적',
      category_id: 1,
      category_name: '교통',
    },
    {
      sound_id: 2,
      name: '사이렌',
      category_id: 1,
      category_name: '교통',
    },
    {
      sound_id: 3,
      name: '초인종',
      category_id: 2,
      category_name: '생활',
    },
    {
      sound_id: 4,
      name: '아기 울음소리',
      category_id: 2,
      category_name: '생활',
    },
  ],
};

export const soundCategoriesMock: GetSoundCategoriesResponseTypes = {
  categories: [
    {
      category_id: 1,
      name: '교통',
    },
    {
      category_id: 2,
      name: '생활',
    },
    {
      category_id: 3,
      name: '위험',
    },
  ],
};

export const updateModeSoundsMock: UpdateModeSoundsResponseTypes = {
  mode_id: 1,
  sounds: [
    {
      sound_id: 1,
      name: '자동차 경적',
    },
    {
      sound_id: 2,
      name: '사이렌',
    },
  ],
};
