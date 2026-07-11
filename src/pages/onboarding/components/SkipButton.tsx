import type { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface SkipButtonPropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {}

// 온보딩 하드웨어 연결 단계(HwConnectPage, HwConnectingPage)에서 공통으로 쓰는 "나중에 하기" 버튼.
const SkipButton = ({ className, ...props }: SkipButtonPropTypes) => {
  return (
    <button
      type="button"
      className={twMerge(
        'body-base-regular text-center text-tertiary',
        className,
      )}
      {...props}
    >
      나중에 하기
    </button>
  );
};

export default SkipButton;
