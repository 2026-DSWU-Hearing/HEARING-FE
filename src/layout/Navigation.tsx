import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <NavLink to="/" end>
        홈
      </NavLink>

      <NavLink to="/communication">양방향 소통</NavLink>

      <NavLink to="/live-sound">실시간 소리 감지</NavLink>

      <NavLink to="/setting">설정</NavLink>
    </nav>
  );
};

export default Navigation;
