export type SoundCategory = '긴급' | '생활음' | '길거리' | '사람 소리';

export interface Mode {
  id: number;
  name: string;
  iconLabel: string;
  isActivated: boolean;
}

export interface Sound {
  id: number;
  name: string;
  category: SoundCategory;
  categoryId?: number;
  iconLabel: string;
}

export interface ModeDetail extends Mode {
  sounds: Sound[];
}

export interface HomeSoundFilteringData {
  modes: Mode[];
  containedSounds: Sound[];
  modeDetails: ModeDetail[];
  sounds: Sound[];
}

export interface SoundLibraryData {
  categories: SoundCategory[];
  sounds: Sound[];
}

export interface ModeListItemResponseTypes {
  mode_id: number;
  name: string;
  icon: string;
  is_active: boolean;
}

export interface ModeListResponseTypes {
  modes: ModeListItemResponseTypes[];
}

export interface ModeSoundResponseTypes {
  sound_id: number;
  name: string;
  category: SoundCategory;
}

export interface ModeDetailResponseTypes extends ModeListItemResponseTypes {
  sounds: ModeSoundResponseTypes[];
}

export interface ModeDetailListResponseTypes {
  modes: ModeDetailResponseTypes[];
}

export interface SoundResponseTypes {
  sound_id: number;
  name: string;
  category_id: number;
  category_name: SoundCategory;
}

export interface SoundListResponseTypes {
  sounds: SoundResponseTypes[];
}

export interface SoundCategoryResponseTypes {
  category_id: number;
  name: SoundCategory;
}

export interface SoundCategoryListResponseTypes {
  categories: SoundCategoryResponseTypes[];
}

export interface ModeRequestBodyTypes {
  name: string;
  icon: string;
  sound_ids: number[];
}
