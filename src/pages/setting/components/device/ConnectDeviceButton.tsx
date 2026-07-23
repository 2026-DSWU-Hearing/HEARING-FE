import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ConnectDeviceButtonPropTypes {
  onClick: () => void;
  /** 버튼 텍스트. 미지정 시 "디바이스 연결하기" */
  label?: string;
  /** 요청 진행 중 연타 방지용 비활성화 여부. 미지정 시 false */
  disabled?: boolean;
}

// 디바이스 연결/등록 시 표시하는 골드 그라데이션 버튼.

const ConnectDeviceButton = ({
  onClick,
  label = '디바이스 연결하기',
  disabled = false,
}: ConnectDeviceButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-sm rounded-lg py-sm tag-glass-effect disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background:
          'linear-gradient(0deg, rgba(242, 178, 4, 0.70) 0%, rgba(255, 226, 110, 0.70) 100%), rgba(255, 209, 66, 0.20)',
      }}
    >
      <span className="heading-lg-semibold text-neutral-100">{label}</span>
      <FontAwesomeIcon
        icon={faMicrochip}
        className="text-[1.5rem] text-neutral-100"
      />
    </button>
  );
};

export default ConnectDeviceButton;
