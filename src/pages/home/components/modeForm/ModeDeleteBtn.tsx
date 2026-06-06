interface ModeDeleteBtnPropTypes {
  onClick: () => void;
  disabled?: boolean;
}

const ModeDeleteBtn = ({
  onClick,
  disabled = false,
}: ModeDeleteBtnPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-[8.4rem] h-[2.0625rem] rounded-pill bg-[#5354504D]/30 px-xs py-xxs caption-xs-medium text-secondary border-[1px] border-neutral-700 disabled:bg-neutral-200 disabled:text-neutral-400"
    >
      모드 삭제하기
    </button>
  );
};

export default ModeDeleteBtn;
