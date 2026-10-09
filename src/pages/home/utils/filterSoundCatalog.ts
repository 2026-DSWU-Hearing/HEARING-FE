import type {
  CategoryTypes,
  SoundTypes,
} from '@/pages/home/types/soundTypes';

const REMOVED_CATEGORY_NAME = '음악';
const REMOVED_SOUND_NAMES = new Set(['주방 도구']);

export const filterVisibleCategories = (categories: CategoryTypes[]) =>
  categories.filter((category) => category.name !== REMOVED_CATEGORY_NAME);

export const filterVisibleSounds = (sounds: SoundTypes[]) =>
  sounds.filter(
    (sound) =>
      sound.category_name !== REMOVED_CATEGORY_NAME &&
      !REMOVED_SOUND_NAMES.has(sound.name),
  );
