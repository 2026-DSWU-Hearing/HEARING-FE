import type {
  HomeSoundFilteringData,
  Mode,
  ModeDetail,
  ModeDetailListResponseTypes,
  ModeDetailResponseTypes,
  ModeListItemResponseTypes,
  ModeListResponseTypes,
  ModeSoundResponseTypes,
  Sound,
  SoundCategoryListResponseTypes,
  SoundLibraryData,
  SoundListResponseTypes,
  SoundResponseTypes,
} from '../types/soundFiltering';

const DATA_BASE_URL = '/data';

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${DATA_BASE_URL}/${path}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return response.json() as Promise<T>;
};

const SOUND_ICON_LABEL_BY_ID: Record<number, string> = {
  1: '물방울',
  2: '문',
  3: '불',
  4: '총',
  5: '사람',
  6: '주전자',
  7: '자동차',
};

const mapModeResponseToMode = (mode: ModeListItemResponseTypes): Mode => {
  return {
    id: mode.mode_id,
    name: mode.name,
    iconLabel: mode.icon,
    isActivated: mode.is_active,
  };
};

const mapModeSoundResponseToSound = (sound: ModeSoundResponseTypes): Sound => {
  return {
    id: sound.sound_id,
    name: sound.name,
    category: sound.category,
    iconLabel: SOUND_ICON_LABEL_BY_ID[sound.sound_id] ?? sound.name,
  };
};

const mapModeDetailResponseToModeDetail = (
  mode: ModeDetailResponseTypes,
): ModeDetail => {
  return {
    ...mapModeResponseToMode(mode),
    sounds: mode.sounds.map(mapModeSoundResponseToSound),
  };
};

const mapSoundResponseToSound = (sound: SoundResponseTypes): Sound => {
  return {
    id: sound.sound_id,
    name: sound.name,
    category: sound.category_name,
    categoryId: sound.category_id,
    iconLabel: SOUND_ICON_LABEL_BY_ID[sound.sound_id] ?? sound.name,
  };
};

export const getModes = () => {
  return fetchJson<ModeListResponseTypes>('modes.json').then((data) =>
    data.modes.map(mapModeResponseToMode),
  );
};

export const getContainedSounds = () => {
  return fetchJson<{ sounds: ModeSoundResponseTypes[] }>(
    'contained-sounds.json',
  ).then((data) => data.sounds.map(mapModeSoundResponseToSound));
};

export const getModeDetails = () => {
  return fetchJson<ModeDetailListResponseTypes>('mode-details.json').then(
    (data) => data.modes.map(mapModeDetailResponseToModeDetail),
  );
};

export const getSoundCategories = () => {
  return fetchJson<SoundCategoryListResponseTypes>(
    'sound-categories.json',
  ).then((data) => data.categories.map((category) => category.name));
};

export const getSounds = () => {
  return fetchJson<SoundListResponseTypes>('sounds.json').then((data) =>
    data.sounds.map(mapSoundResponseToSound),
  );
};

export const getHomeSoundFilteringData =
  async (): Promise<HomeSoundFilteringData> => {
    const [modes, modeDetails, sounds] = await Promise.all([
      getModes(),
      getModeDetails(),
      getSounds(),
    ]);

    const activatedMode = modes.find((mode) => mode.isActivated);
    const activatedModeDetail = modeDetails.find(
      (mode) => mode.id === activatedMode?.id,
    );
    const containedSounds = activatedModeDetail?.sounds ?? [];

    return { modes, containedSounds, modeDetails, sounds };
  };

export const getSoundLibraryData = async (): Promise<SoundLibraryData> => {
  const [categories, sounds] = await Promise.all([
    getSoundCategories(),
    getSounds(),
  ]);

  return { categories, sounds };
};
