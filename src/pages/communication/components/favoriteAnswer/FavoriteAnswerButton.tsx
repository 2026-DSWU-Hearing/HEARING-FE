interface FavoriteAnswerButtonPropTypes {
  onClick: () => void;
}

const FavoriteAnswerButton = ({ onClick }: FavoriteAnswerButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
    >
      답변 버튼
    </button>
  );
};

export default FavoriteAnswerButton;
