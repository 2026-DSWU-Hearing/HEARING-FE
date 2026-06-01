import type { SoundTypes } from '@/pages/home/types/soundTypes';

// 모드 단건 (백엔드 ModeResponse) — 목록/상세 모두 동일 형태, sounds 포함
export interface ModeTypes {
  id: number;
  name: string;
  icon: string;
  is_active: boolean;
  sounds: SoundTypes[];
}

// GET /modes 는 배열을 직접 반환한다.
export type GetModesResponseTypes = ModeTypes[];

// GET /modes/{id} 응답 (ModeResponse 동일)
export type GetModeDetailResponseTypes = ModeTypes;

// POST /modes 요청 (백엔드 ModeCreate)
export interface CreateModeRequestTypes {
  name: string;
  icon: string;
  sound_ids: number[];
}

// POST /modes 응답 (ModeResponse)
export type CreateModeResponseTypes = ModeTypes;

// PATCH /modes/{id} 요청 (백엔드 ModeUpdate) — 이름/아이콘만 수정
export interface UpdateModeRequestTypes {
  name?: string;
  icon?: string;
}

// PATCH /modes/{id} 응답 (ModeResponse)
export type UpdateModeResponseTypes = ModeTypes;

// POST /modes/{id}/activate 응답 (ModeResponse)
export type ActivateModeResponseTypes = ModeTypes;

// PUT /modes/{id}/sounds 응답 (ModeResponse)
export type UpdateModeSoundsResponseTypes = ModeTypes;
