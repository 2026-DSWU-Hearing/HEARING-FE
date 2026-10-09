import { createElement } from 'react';
import { getModeIconComponent } from '@/shared/components/icons/modes/modeIconMap';

interface ModeIconViewPropTypes {
  iconKey: string;
  className?: string;
}

// icon_key 문자열을 받아 해당 아이콘 컴포넌트를 그려주는 공용 래퍼.
// fill="currentColor"라서 부모의 text-* 색상을 그대로 따라간다.
const ModeIconView = ({ iconKey, className }: ModeIconViewPropTypes) => {
  const IconComponent = getModeIconComponent(iconKey);

  return createElement(IconComponent, { className });
};

export default ModeIconView;
