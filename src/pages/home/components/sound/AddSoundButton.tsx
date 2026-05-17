interface AddSoundButtonProps {
  onClick: () => void;
}

const AddSoundButton = ({ onClick }: AddSoundButtonProps) => {
  return (
    <div className="flex flex-row justify-center items-center mt-4 gap-2 bg-gray-300 rounded-lg w-35 h-10">
      <button type="button" onClick={onClick}>
        소리 추가하기
      </button>
      <div className="flex">+</div>
    </div>
  );
};

export default AddSoundButton;
