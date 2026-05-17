export type SoundCategory = '긴급' | '생활음' | '길거리' | '사람 소리';

export interface Mode {
  id: number;
  name: string;
  iconLabel: string;
}

export interface Sound {
  id: number;
  name: string;
  category: SoundCategory;
  iconLabel: string;
}

export interface HomeSoundFilteringData {
  modes: Mode[];
  containedSounds: Sound[];
}

export interface SoundLibraryData {
  categories: SoundCategory[];
  sounds: Sound[];
}
