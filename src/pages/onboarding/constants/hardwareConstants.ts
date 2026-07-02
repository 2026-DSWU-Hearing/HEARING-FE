import ing1Icon from '@/shared/assets/icons/onboarding/ing1.svg';
import ing2Icon from '@/shared/assets/icons/onboarding/ing2.svg';
import ing3Icon from '@/shared/assets/icons/onboarding/ing3.svg';

export const CONNECTING_FRAME_DELAY_MS = 500;
export const DEVICE_POLLING_INTERVAL_MS = 1000;

export const CONNECTING_FRAMES = [
  {
    iconSrc: ing1Icon,
    iconClassName: 'h-[104px] w-[104px]',
    text: '연결 중 .',
  },
  {
    iconSrc: ing2Icon,
    iconClassName: 'h-[146px] w-[146px]',
    text: '연결 중 ..',
  },
  {
    iconSrc: ing3Icon,
    iconClassName: 'h-[198px] w-[198px]',
    text: '연결 중 ...',
  },
  {
    iconSrc: ing2Icon,
    iconClassName: 'h-[146px] w-[146px]',
    text: '연결 중 ..',
  },
] as const;
