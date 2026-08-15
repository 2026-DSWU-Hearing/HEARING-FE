import type {
  CategoryTypes,
  SoundTypes,
} from '@/pages/home/types/soundTypes';

const REMOVED_CATEGORY_NAME = '음악';

export const filterVisibleCategories = (categories: CategoryTypes[]) =>
  categories.filter((category) => category.name !== REMOVED_CATEGORY_NAME);

export const filterVisibleSounds = (sounds: SoundTypes[]) =>
  sounds.filter((sound) => sound.category_name !== REMOVED_CATEGORY_NAME);
