import { NavLink, useLocation } from 'react-router-dom';
import type { ComponentType } from 'react';

import HomeIcon from '@/shared/components/icons/HomeIcon';
import CommunicationIcon from '@/shared/components/icons/CommunicationIcon';
import LiveSoundIcon from '@/shared/components/icons/LiveSoundIcon';
import SettingIcon from '@/shared/components/icons/SettingIcon';

interface NavigationItemTypes {
  to: string;
  end?: boolean;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const NAVIGATION_ITEMS: NavigationItemTypes[] = [
  { to: '/', end: true, label: '홈', Icon: HomeIcon },
  { to: '/communication', label: '양방향 소통', Icon: CommunicationIcon },
  { to: '/live-sound', label: '실시간 소리 감지', Icon: LiveSoundIcon },
  { to: '/setting', label: '설정', Icon: SettingIcon },
];

const HIDDEN_NAVIGATION_PATHS = ['/login'];

const BottomNavigation = () => {
  const location = useLocation();

  const isNavigationHidden = HIDDEN_NAVIGATION_PATHS.includes(
    location.pathname,
  );

  if (isNavigationHidden) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 z-10 flex h-[5.1875rem] w-full max-w-[430px] items-center justify-around bg-background-neutral-base px-3">
      {NAVIGATION_ITEMS.map(({ to, end, label, Icon }) => (
        <NavLink key={to} to={to} end={end} aria-label={label}>
          {({ isActive }) => (
            // 활성 글로우는 filter: drop-shadow 대신 원형 래퍼의 box-shadow로 그린다.
            // iOS WebKit은 fixed 레이어 안 SVG에 filter를 걸면 사각 바운딩 박스가 비치는 버그가 있다.
            <span
              className={`flex h-[2.234rem] w-[2.234rem] items-center justify-center rounded-full ${
                isActive ? 'text-white shadow-light-10' : 'text-neutral-500'
              }`}
            >
              <Icon className="h-full w-full" />
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
