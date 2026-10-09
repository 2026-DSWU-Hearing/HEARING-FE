// 모드에 담을 소리를 서버에 보낼 때 쓰는 입력 형태 (POST/PUT 요청 바디)
export interface ModeSoundTypes {
  sound_id: number;
  name: string;
}

// 서버가 돌려주는 모드 소리 항목. 상세 조회·생성·수정·소리 교체 응답이 모두 이 형태를 공유한다.
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
  sounds: ModeDetailSoundTypes[];
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
  sounds: ModeDetailSoundTypes[];
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
