import { Link } from 'react-router-dom';

const AddModeButton = () => {
  return (
    <Link to="/modes/new">
      새 모드 추가하기
      <span aria-hidden="true">+</span>
    </Link>
  );
};

export default AddModeButton;
