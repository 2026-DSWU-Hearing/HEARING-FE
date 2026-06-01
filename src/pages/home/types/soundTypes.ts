export interface SoundTypes {
  sound_id: number;
  name: string;
  category_id: number;
  category_name: string;
}

export interface CategoryTypes {
  category_id: number;
  name: string;
}

export interface ModeSoundTypes {
  sound_id: number;
  name: string;
}

export interface GetSoundsResponseTypes {
  sounds: SoundTypes[];
}

export interface GetSoundCategoriesResponseTypes {
  categories: CategoryTypes[];
}

export interface UpdateModeSoundsRequestTypes {
  sounds: ModeSoundTypes[];
}

export interface UpdateModeSoundsResponseTypes {
  mode_id: number;
  sounds: ModeSoundTypes[];
}
