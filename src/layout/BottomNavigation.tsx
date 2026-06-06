import { NavLink } from 'react-router-dom';
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

const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0  z-10 flex h-[5.1875rem] w-full max-w-[430px] justify-around bg-background-neutral-base px-3 items-center">
      {NAVIGATION_ITEMS.map(({ to, end, label, Icon }) => (
        <NavLink key={to} to={to} end={end} aria-label={label}>
          {({ isActive }) => (
            <Icon
              className={`h-[2.234rem] w-[2.234rem] ${
                isActive
                  ? 'text-white drop-shadow-[0_0_10px_rgba(255,249,212,0.50)]'
                  : 'text-neutral-500'
              }`}
            />
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
