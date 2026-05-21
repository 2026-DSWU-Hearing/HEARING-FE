import type { GetModesResponseTypes } from '@/pages/home/types/modeCardTypes';

export const modeMock: GetModesResponseTypes = {
  modes: [
    {
      mode_id: 1,
      name: '실외',
      icon: '바깥',
      is_active: false,
    },
    {
      mode_id: 2,
      name: '가정',
      icon: '집',
      is_active: true,
    },
    {
      mode_id: 3,
      name: '안전',
      icon: '주의',
      is_active: false,
    },
  ],
};
