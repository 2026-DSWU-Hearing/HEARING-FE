import { faMobileVibrate } from '@fortawesome/free-solid-svg-icons';

import SettingSectionTitle from '@/pages/setting/components/SettingSectionTitle';
import SettingCard from '@/pages/setting/components/SettingCard';
import HapticSlider from '@/pages/setting/components/device/HapticSlider';
import { SettingCardSkeleton } from '@/pages/setting/components/SettingSkeleton';
import { useDeviceConnection } from '@/pages/setting/hooks/useDeviceConnection';
import { useHapticStrength } from '@/pages/setting/hooks/useHapticStrength';

/**
 * 진동 강도 설정 섹션.
 * 섹션 제목(액션 없음) + 진동 카드(햅틱 강도 헤더 + 강도 슬라이더)로 구성한다.
 * 값·저장 로직은 useHapticStrength에 있다(드래그 중 즉시 반영, 확정 시 디바운스 저장, 실패 시 복구).
 * 진동은 넥밴드에 적용되는 값이므로, 내 계정이 활성 사용자로 연결된 기기가 있을 때만 표시한다.
 */
const HapticSection = () => {
  const { isMyDeviceConnected } = useDeviceConnection();
  const {
    hapticStrength,
    saveErrorMessage,
    isLoading,
    handleStrengthChange,
    handleStrengthChangeEnd,
  } = useHapticStrength();

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
        {saveErrorMessage && (
          <p
            role="alert"
            className="mt-xs whitespace-pre-line text-center caption-xs-regular text-state-alert"
          >
            {saveErrorMessage}
          </p>
        )}
      </SettingCard>
    </section>
  );
};

export default HapticSection;
