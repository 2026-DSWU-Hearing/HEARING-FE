import { useState } from 'react';
import { faMobileVibrate } from '@fortawesome/free-solid-svg-icons';

import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import HapticSlider from '@/pages/setting/components/device/HapticSlider';

/**
 * 진동 강도 설정 섹션.
 * 섹션 제목(액션 없음) + 진동 카드(햅틱 강도 헤더 + 강도 슬라이더)로 구성한다.
 */
const HapticSection = () => {
  // TODO(api): GET /devices/haptic(가칭)로 저장된 강도 조회 후 초기값을 대체한다.
  const [hapticStrength, setHapticStrength] = useState(70);

  const handleStrengthChange = (value: number) => {
    setHapticStrength(value);
    // TODO(api): 디바운스 후 PATCH /devices/haptic 으로 강도 저장.
  };

  return (
    <section className="flex flex-col gap-sm">
      <SettingSectionTitle title="진동 강도 설정" />
      <SettingCard
        icon={faMobileVibrate}
        label="햅틱 강도 조절"
        title="햅틱 피드백 강도"
      >
        <HapticSlider value={hapticStrength} onChange={handleStrengthChange} />
      </SettingCard>
    </section>
  );
};

export default HapticSection;
