import DoNotDisturbIcon from '@/shared/components/icons/DoNotDisturbIcon';

const ON_THUMB_BACKGROUND =
  'linear-gradient(180deg, rgba(242, 178, 4, 0.50) 0%, rgba(255, 249, 212, 0.50) 100%), radial-gradient(45.95% 45.95% at 50% 54.05%, #FFE26E 0%, #F2B204 100%)';

// 상태(on/off)에 따라 달라지는 클래스만 모음. 고정 클래스는 JSX 템플릿에 그대로 둔다.
const STYLES = {
  button: {
    on: 'border-card-true',
    off: 'border-[0.5px] border-neutral-500',
  },
  text: {
    on: 'left-[0.875rem] pr-[2.5rem] text-primary',
    off: 'right-[0.875rem] pl-[2.5rem] text-tertiary',
  },
  thumb: {
    on: 'translate-x-[5.5rem] shadow-light-20',
    off: 'translate-x-0 bg-tertiary',
  },
  icon: {
    on: 'text-primary',
    off: 'text-disabled',
  },
};

interface DoNotDisturbButtonPropTypes {
  isDoNotDisturb: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
}

const DoNotDisturbButton = ({
  isDoNotDisturb,
  isDisabled = false,
  onToggle,
}: DoNotDisturbButtonPropTypes) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDoNotDisturb}
      aria-label="방해금지 모드"
      disabled={isDisabled}
      onClick={onToggle}
      className={`p-xxs relative h-[2.75rem] w-[8rem] rounded-pill bg-black disabled:cursor-not-allowed disabled:opacity-60 ${
        isDoNotDisturb ? STYLES.button.on : STYLES.button.off
      }`}
    >
      {/* 텍스트: thumb 반대편에 고정 */}
      <span
        className={`caption-xs-regular absolute top-1/2 -translate-y-1/2 whitespace-nowrap transition-all ${
          isDoNotDisturb ? STYLES.text.on : STYLES.text.off
        }`}
      >
        방해금지 모드 {isDoNotDisturb ? 'on' : 'off'}
      </span>

      {/* thumb 역할의 달 아이콘 원: off=왼쪽, on=오른쪽으로 미끄러짐 */}
      <span
        style={isDoNotDisturb ? { background: ON_THUMB_BACKGROUND } : undefined}
        className={`absolute top-[0.375rem] left-[0.375rem] flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-pill transition-all duration-300 ease-in-out ${
          isDoNotDisturb ? STYLES.thumb.on : STYLES.thumb.off
        }`}
      >
        <DoNotDisturbIcon
          className={`h-[1rem] w-[1rem] ${
            isDoNotDisturb ? STYLES.icon.on : STYLES.icon.off
          }`}
        />
      </span>
    </button>
  );
};

export default DoNotDisturbButton;
