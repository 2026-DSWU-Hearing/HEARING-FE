import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FaModeIconPropTypes {
  icon: IconDefinition;
  className?: string;
}

// FontAwesome 아이콘은 글리프 내부 여백 때문에 인라인 SVG보다 작아 보인다.
// 부모가 준 박스(className)를 div가 채우고, 그 안에서 FA를 중앙 정렬하면서
// text-* 크기로 살짝 키워 직접 그린 SVG 아이콘과 시각적 크기를 맞춘다.
const FaModeIcon = ({ icon, className }: FaModeIconPropTypes) => (
  <span
    className={`flex items-center justify-center text-[1.5rem] ${className ?? ''}`}
  >
    <FontAwesomeIcon icon={icon} />
  </span>
);

export default FaModeIcon;
