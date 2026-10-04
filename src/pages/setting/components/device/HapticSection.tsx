import { useEffect, useRef, useState } from 'react';
import { faMobileVibrate } from '@fortawesome/free-solid-svg-icons';

import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import HapticSlider from '@/pages/setting/components/device/HapticSlider';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { useGetUsers } from '@/shared/hooks/useGetUsers';
import { usePatchHaptic } from '@/pages/setting/hooks/usePatchHaptic';
import { useDeviceConnection } from '@/pages/setting/hooks/useDeviceConnection';

/**
 * 진동 강도 설정 섹션.
 * 섹션 제목(액션 없음) + 진동 카드(햅틱 강도 헤더 + 강도 슬라이더)로 구성한다.
 * 드래그 중에는 로컬 state로 즉시 반영하고, 드래그 종료 시에만 PATCH로 저장한다.
 * 진동은 넥밴드에 적용되는 값이므로, 내 계정이 활성 사용자로 연결된 기기가 있을 때만 표시한다.
 */
const HapticSection = () => {
  const { data: user, isLoading } = useGetUsers();
  const { mutate: updateHaptic } = usePatchHaptic();
  const { isMyDeviceConnected } = useDeviceConnection();

  const [hapticStrength, setHapticStrength] = useState(0);

  // 조회한 저장값으로 슬라이더 초기값을 한 번만 채운다(드래그 중 덮어쓰기 방지).
  const isInitialized = useRef(false);
  useEffect(() => {
    if (isInitialized.current || !user) {
      return;
    }

    setHapticStrength(user.haptic_strength);
    isInitialized.current = true;
  }, [user]);

  // 드래그 중: 화면만 즉시 갱신한다.
  const handleStrengthChange = (value: number) => {
    setHapticStrength(value);
  };

  // 드래그 종료/키보드 입력: 확정된 값을 서버에 저장한다.
  const handleStrengthChangeEnd = (value: number) => {
    updateHaptic({ haptic_strength: value });
  };

  // 기기 미연결·로딩·에러·타 계정 활성 상태에서는 섹션 자체를 그리지 않는다.
  if (!isMyDeviceConnected) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="flex flex-col gap-sm">
        <SettingSectionTitle title="진동 강도 설정" />
        <SettingCardSkeleton />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-sm">
      <SettingSectionTitle title="진동 강도 설정" />
      <SettingCard
        icon={faMobileVibrate}
        label="햅틱 강도 조절"
        title="햅틱 피드백 강도"
      >
        <HapticSlider
          value={hapticStrength}
          onChange={handleStrengthChange}
          onChangeEnd={handleStrengthChangeEnd}
        />
      </SettingCard>
    </section>
  );
};

export default HapticSection;
