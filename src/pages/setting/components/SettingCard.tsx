import type { ReactNode } from 'react';

import SettingCardHeader, {
  type SettingCardHeaderPropTypes,
} from '@/pages/setting/components/SettingCardHeader';

interface SettingCardPropTypes extends SettingCardHeaderPropTypes {
  /** 카드 본문 (배터리·연결 상태 그리드 또는 진동 슬라이더 등) */
  children: ReactNode;
}

/**
 * 설정 카드 공통 골격.
 * 상단 공통 헤더(아이콘·라벨·제목·편집) + 하단 본문(children)으로 구성한다.
 * 나의 디바이스·진동 강도 설정 등에서 본문만 갈아끼워 재사용한다.
 */
const SettingCard = ({
  icon,
  label,
  title,
  onEdit,
  children,
}: SettingCardPropTypes) => {
  return (
    <div className="flex flex-col gap-xs rounded-xl bg-[#21221E80]/50 tag-glass-effect px-base py-lg">
      <SettingCardHeader
        icon={icon}
        label={label}
        title={title}
        onEdit={onEdit}
      />
      {children}
    </div>
  );
};

export default SettingCard;
