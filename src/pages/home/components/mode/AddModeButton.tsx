import { Link } from 'react-router-dom';

const AddModeButton = () => {
  return (
    <Link
      to="/modes/new"
      className="inline-flex w-fit items-center justify-center self-center rounded-2xl bg-gray-300 p-3 my-2 gap-2"
    >
      새 모드 추가하기
      <span aria-hidden="true">+</span>
    </Link>
  );
};

export default AddModeButton;
