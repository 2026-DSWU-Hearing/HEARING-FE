import { getModeIconComponent } from '@/pages/home/constants/modeIcons';

interface ModeIconViewPropTypes {
  iconKey: string;
  className?: string;
}

// icon_key 문자열을 받아 해당 아이콘 컴포넌트를 그려주는 공용 래퍼.
// fill="currentColor"라서 부모의 text-* 색상을 그대로 따라간다.
// 매핑 결과를 JSX 태그(<IconComponent />)로 쓰면 린트가 "렌더 중 컴포넌트 생성"으로
// 오인하므로, 상태 없는 순수 아이콘 컴포넌트를 함수로 직접 호출해 엘리먼트를 만든다.
const ModeIconView = ({ iconKey, className }: ModeIconViewPropTypes) => {
  const renderModeIcon = getModeIconComponent(iconKey);

  return renderModeIcon({ className });
};

export default ModeIconView;
