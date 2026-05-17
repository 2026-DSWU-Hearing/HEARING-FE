interface AddSoundButtonProps {
  onClick: () => void;
}

const AddSoundButton = ({ onClick }: AddSoundButtonProps) => {
  return (
    <button
      type="button"
      className="inline-flex w-fit items-center justify-center self-center rounded-2xl bg-gray-300 p-3 my-2 gap-2 cursor-pointer"
      onClick={onClick}
    >
      소리 추가하기
      <span aria-hidden="true">+</span>
    </button>
  );
};

export default AddSoundButton;
