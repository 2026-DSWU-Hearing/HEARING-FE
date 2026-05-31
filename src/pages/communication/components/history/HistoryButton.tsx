
interface HistoryButtonPropTypes {
  onClick: () => void;
}

const HistoryButton = ({ onClick }: HistoryButtonPropTypes) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700"
    >
      대화 기록
    </button>
  );
};

export default HistoryButton;
