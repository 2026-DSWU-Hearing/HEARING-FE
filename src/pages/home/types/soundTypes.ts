// 소리 카테고리 (백엔드 SoundCategoryResponse)
export interface CategoryTypes {
  id: number;
  name: string;
}

// 소리 단건 (백엔드 SoundResponse)
export interface SoundTypes {
  id: number;
  name: string;
  risk_level: string;
  icon_url: string | null;
  category: CategoryTypes;
}

// 모드 소리 목록 수정 요청 (백엔드 ModeSoundsUpdate)
export interface UpdateModeSoundsRequestTypes {
  sound_ids: number[];
}

// GET /sounds, GET /sounds/categories 는 배열을 직접 반환한다.
export type GetSoundsResponseTypes = SoundTypes[];

export type GetSoundCategoriesResponseTypes = CategoryTypes[];
