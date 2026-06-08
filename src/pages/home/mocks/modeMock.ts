import type {
  ActivateModeResponseTypes,
  CreateModeResponseTypes,
  GetModeDetailResponseTypes,
  GetModesResponseTypes,
  UpdateModeResponseTypes,
} from '@/pages/home/types/modeTypes';

export const modeMock: GetModesResponseTypes = {
  modes: [
    {
      mode_id: 1,
      name: '실외',
      icon: 'ic_goingOut',
      is_active: false,
    },
    {
      mode_id: 2,
      name: '가정',
      icon: 'ic_workplace',
      is_active: true,
    },
    {
      mode_id: 3,
      name: '안전',
      icon: 'ic_emergency',
      is_active: false,
    },
  ],
};

export const modeDetailMock: GetModeDetailResponseTypes = {
  mode_id: 1,
  name: '실외',
  icon: 'ic_goingOut',
  is_active: false,
  sounds: [
    {
      sound_id: 1,
      name: '자동차 경적',
      category: '교통',
      is_active: true,
    },
    {
      sound_id: 2,
      name: '사이렌',
      category: '위험',
      is_active: false,
    },
  ],
};

export const createModeMock: CreateModeResponseTypes = {
  mode_id: 4,
  name: '새 모드',
  icon: 'ic_study',
  sounds: [
    {
      sound_id: 1,
      name: '자동차 경적',
    },
  ],
};

export const updateModeMock: UpdateModeResponseTypes = {
  mode_id: 1,
  name: '수정된 모드',
  icon: 'ic_meeting',
  sounds: [
    {
      sound_id: 2,
      name: '사이렌',
    },
  ],
};

export const activateModeMock: ActivateModeResponseTypes = {
  mode_id: 1,
  is_active: true,
};
