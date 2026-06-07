import SilentModeIcon from '@/shared/components/icons/SilentModeIcon';

interface SilentModeButtonPropTypes {
  isSilent: boolean;
  onToggle: () => void;
}

const SilentModeButton = ({
  isSilent,
  onToggle,
}: SilentModeButtonPropTypes) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isSilent}
      aria-label="방해금지 모드"
      onClick={onToggle}
      className="p-xxs relative h-[2.75rem] w-[8rem] border-[0.5px] border-neutral-500 rounded-pill bg-black"
    >
      {/* 텍스트: thumb 반대편에 고정 */}
      <span
        className={`caption-xs-regular absolute top-1/2 -translate-y-1/2 text-primary transition-all ${
          isSilent ? 'left-[0.875rem]' : 'right-[0.875rem]'
        }`}
      >
        방해금지 모드 {isSilent ? 'on' : 'off'}
      </span>

      {/* thumb 역할의 달 아이콘 원: off=왼쪽, on=오른쪽으로 미끄러짐 */}
      <span
        className={`absolute top-[0.375rem] left-[0.375rem] flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-pill transition-all duration-300 ease-in-out ${
          isSilent
            ? 'translate-x-[5.5rem] bg-primary-500 shadow-light-20'
            : 'translate-x-0 bg-tertiary'
        }`}
      >
        <SilentModeIcon
          className={`h-[1rem] w-[1rem] ${
            isSilent ? 'text-primary' : 'text-disabled'
          }`}
        />
      </span>
    </button>
  );
};

export default SilentModeButton;
