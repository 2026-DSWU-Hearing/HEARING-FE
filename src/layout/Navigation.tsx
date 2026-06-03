import { NavLink } from 'react-router-dom';
import homeIcon from '@/shared/assets/icons/navigation/bottom_navigation_home.svg';
import communicationIcon from '@/shared/assets/icons/navigation/bottom_navigation_communication.svg';
import liveSoundIcon from '@/shared/assets/icons/navigation/bottom_navigation_livesound.svg';
import settingIcon from '@/shared/assets/icons/navigation/bottom_navigation_setting.svg';

const Navigation = () => {
  return (
    <nav className="fixed bottom-0  z-10 flex h-[5.1875rem] w-full max-w-[430px] justify-around bg-background-neutral-base px-3 items-center">
      <NavLink to="/" end>
        <img src={homeIcon} alt="홈" className="h-[2.234rem] w-[2.234rem]" />
      </NavLink>

      <NavLink to="/communication">
        <img
          src={communicationIcon}
          alt="양방향 소통"
          className="h-[2.234rem] w-[2.234rem]"
        />
      </NavLink>

      <NavLink to="/live-sound">
        <img
          src={liveSoundIcon}
          alt="실시간 소리 감지"
          className="h-[2.234rem] w-[2.234rem]"
        />
      </NavLink>

      <NavLink to="/setting">
        <img
          src={settingIcon}
          alt="설정"
          className="h-[2.234rem] w-[2.234rem]"
        />
      </NavLink>
    </nav>
  );
};

export default Navigation;
