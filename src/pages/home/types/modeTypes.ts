export interface ModeSoundTypes {
  sound_id: number;
  name: string;
}

export interface ModeDetailSoundTypes extends ModeSoundTypes {
  category: string;
  is_active: boolean;
}

export interface ModeTypes {
  mode_id: number;
  name: string;
  icon: string;
  is_active: boolean;
}

export interface GetModesResponseTypes {
  modes: ModeTypes[];
}

export interface CreateModeRequestTypes {
  name: string;
  icon: string;
  sounds: ModeSoundTypes[];
}

export interface CreateModeResponseTypes {
  mode_id: number;
  name: string;
  icon: string;
  sounds: ModeSoundTypes[];
}

export interface GetModeDetailResponseTypes {
  mode_id: number;
  name: string;
  icon: string;
  is_active: boolean;
  sounds: ModeDetailSoundTypes[];
}

export interface UpdateModeRequestTypes {
  name: string;
  icon: string;
  sounds: ModeSoundTypes[];
}

export interface UpdateModeResponseTypes {
  mode_id: number;
  name: string;
  icon: string;
  sounds: ModeSoundTypes[];
}

export interface ActivateModeResponseTypes {
  mode_id: number;
  is_active: boolean;
}

export interface UpdateModeSoundActiveRequestTypes {
  is_active: boolean;
}

export interface UpdateModeSoundActiveResponseTypes {
  mode_id: number;
  sound_id: number;
  is_active: boolean;
}

export interface ModeIconCatalogItemTypes {
  mode_id: number;
  name_ko: string;
  name_key: string;
  icon_key: string;
}

export interface GetModeIconsResponseTypes {
  icons: ModeIconCatalogItemTypes[];
}
