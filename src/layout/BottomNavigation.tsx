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
  Icon: ComponentType<{ className?: string; filterId?: string }>;
}

// 활성 아이콘 글로우 SVG 필터 id (문서 내 유일해야 한다).
const GLOW_FILTER_ID = 'navigation-icon-glow';

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
      {/* 활성 아이콘 글로우용 SVG 필터. CSS filter: drop-shadow는 iOS에서 fixed 레이어 안 SVG의
          사각 바운딩 박스가 비치거나 페이지 전환 후 이전 글로우가 남는 버그가 있어, SVG 엔진이 그리는
          <filter>로 같은 효과(0 0 10px rgba(255,249,212,.5))를 낸다. 번짐이 잘리지 않도록
          필터 영역을 아이콘 박스보다 넓게 잡고, 아이콘 svg에는 overflow-visible을 준다. */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <defs>
          <filter
            id={GLOW_FILTER_ID}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="5"
              floodColor="#FFF9D4"
              floodOpacity="0.5"
            />
          </filter>
        </defs>
      </svg>
      {NAVIGATION_ITEMS.map(({ to, end, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          aria-label={label}
          // iOS가 링크 탭 시 띄우는 회색 사각 하이라이트를 끈다.
          className="[-webkit-tap-highlight-color:transparent]"
        >
          {({ isActive }) => (
            <Icon
              filterId={isActive ? GLOW_FILTER_ID : undefined}
              className={`h-[2.234rem] w-[2.234rem] overflow-visible ${
                isActive ? 'text-white' : 'text-neutral-500'
              }`}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
