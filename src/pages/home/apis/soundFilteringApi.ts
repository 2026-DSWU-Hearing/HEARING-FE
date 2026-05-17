import type {
  HomeSoundFilteringData,
  Mode,
  Sound,
  SoundCategory,
  SoundLibraryData,
} from '../types/soundFiltering';

const DATA_BASE_URL = '/data';

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${DATA_BASE_URL}/${path}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return response.json() as Promise<T>;
};

export const getModes = () => {
  return fetchJson<Mode[]>('modes.json');
};

export const getContainedSounds = () => {
  return fetchJson<Sound[]>('contained-sounds.json');
};

export const getSoundCategories = () => {
  return fetchJson<SoundCategory[]>('sound-categories.json');
};

export const getSounds = () => {
  return fetchJson<Sound[]>('sounds.json');
};

export const getHomeSoundFilteringData = async (): Promise<HomeSoundFilteringData> => {
  const [modes, containedSounds] = await Promise.all([
    getModes(),
    getContainedSounds(),
  ]);

  return { modes, containedSounds };
};

export const getSoundLibraryData = async (): Promise<SoundLibraryData> => {
  const [categories, sounds] = await Promise.all([
    getSoundCategories(),
    getSounds(),
  ]);

  return { categories, sounds };
};
