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
      className="rounded-xl bg-neutral-400 px-8 py-3 text-lg font-bold text-neutral-900 disabled:bg-neutral-200 disabled:text-neutral-400"
    >
      모드 삭제하기
    </button>
  );
};

export default ModeDeleteBtn;
