import { createElement } from 'react';
import FaSoundIcon from '@/shared/components/icons/sounds/FaSoundIcon';
import {
  getSoundIcon,
  getSoundSvgIcon,
} from '@/shared/components/icons/sounds/soundIconMap';

interface SoundIconViewPropTypes {
  soundName: string;
  categoryName?: string;
  className?: string;
}

// 소리명(+카테고리)을 받아 해당 아이콘을 그려주는 공용 래퍼.
// 직접 그린 SVG 컴포넌트가 있으면 우선 사용하고, 없으면 FontAwesome으로 폴백한다.
// 두 방식 모두 currentColor를 쓰므로 부모의 text-* 색상을 그대로 따라간다.
// 크기 규칙: 직접 그린 SVG는 w-/h-를, FontAwesome은 font-size(text-)만 따른다.
// 호출부는 반드시 w/h와 text-를 같은 값으로 줘야 두 부류가 같은 크기로 보인다.
const SoundIconView = ({
  soundName,
  categoryName,
  className,
}: SoundIconViewPropTypes) => {
  const SvgIconComponent = getSoundSvgIcon(soundName);

  if (SvgIconComponent) {
    return createElement(SvgIconComponent, { className });
  }

  return (
    <FaSoundIcon
      icon={getSoundIcon(soundName, categoryName)}
      className={className}
    />
  );
};

export default SoundIconView;
