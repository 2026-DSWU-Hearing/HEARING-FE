import type { SoundRateTypes } from '../types/soundRateTypes';

export const LIVE_SOUND_RATE_LIST: SoundRateTypes[] = [
  {
    id: 'conversation',
    label: '대화 소리',
    rate: 64,
  },
  {
    id: 'keyboard',
    label: '키보드 타건음',
    rate: 24,
  },
  {
    id: 'air-conditioner',
    label: '에어컨 소리',
    rate: 12,
  },
];