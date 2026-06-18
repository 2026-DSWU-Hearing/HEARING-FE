import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface FaSoundIconPropTypes {
  icon: IconDefinition;
  className?: string;
}

// FontAwesome SVG는 자체 CSS로 height:1em(= 부모 font-size)을 강제하므로
// h-/w- 퍼센트 클래스가 잘 먹지 않는다. 대신 부모 span의 font-size를 박스 크기에 맞추면
// 글리프가 그 크기로 그려진다(FA의 정석 사용법).
// 크기(font-size)는 사용처마다 다르므로 여기서 박지 않고 호출부 className(또는 상위 font-size)을
// 그대로 따른다. 공용 컴포넌트가 특정 크기를 강제하면 다른 사용처(예: 24px 슬롯)에서 깨진다.
const FaSoundIcon = ({ icon, className }: FaSoundIconPropTypes) => (
  <span
    className={`flex items-center justify-center leading-none ${className ?? ''}`}
  >
    <FontAwesomeIcon icon={icon} />
  </span>
);

export default FaSoundIcon;
