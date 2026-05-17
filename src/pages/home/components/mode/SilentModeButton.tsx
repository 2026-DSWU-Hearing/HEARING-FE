const SilentModeButton = () => {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-fit items-center justify-center self-end rounded-2xl bg-gray-200 px-5 m-2 gap-1"
    >
      방해금지 모드
      <span aria-hidden="true">달</span>
    </button>
  );
};

export default SilentModeButton;
