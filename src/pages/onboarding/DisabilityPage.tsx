import type { ComponentType, SVGProps } from 'react';

import { useNavigate } from 'react-router-dom';

import DisabilityOptionButton from '@/pages/onboarding/components/DisabilityOptionButton';
import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import DeafIcon from '@/shared/components/icons/onboarding/DeafIcon';
import HohIcon from '@/shared/components/icons/onboarding/HohIcon';
import { useOnboardingStore } from '@/pages/onboarding/stores/useOnboardingStore';
import {
  DISABILITY_TYPE,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';

const DISABILITY_OPTIONS = [
  { label: '농인', value: DISABILITY_TYPE.DEAF, Icon: DeafIcon },
  { label: '난청인', value: DISABILITY_TYPE.HARD_OF_HEARING, Icon: HohIcon },
] satisfies {
  label: string;
  value: DisabilityTypeTypes;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[];

const DisabilityPage = () => {
  const navigate = useNavigate();
  const disabilityType = useOnboardingStore((state) => state.disabilityType);
  const setDisabilityType = useOnboardingStore(
    (state) => state.setDisabilityType,
  );

  const isNextButtonDisabled = disabilityType === null;

  const handleNextButtonClick = () => {
    if (isNextButtonDisabled) return;

    navigate('/onboarding/terms');
  };

  return (
    <OnboardingLayout
      title={'장애 유형을\n선택해주세요.'}
      topNavigation={
        <OnboardingTopNavigation
          onBackClick={() => navigate('/onboarding/nickname')}
        />
      }
      bottomButton={
        <LongConfirmButton
          disabled={isNextButtonDisabled}
          onClick={handleNextButtonClick}
        >
          다음으로
        </LongConfirmButton>
      }
    >
      <div className="mx-auto mt-[152px] flex h-[158px] w-[310px] items-center justify-center gap-[18px]">
        {DISABILITY_OPTIONS.map(({ label, value, Icon }) => (
          <DisabilityOptionButton
            key={value}
            label={label}
            Icon={Icon}
            isSelected={disabilityType === value}
            onClick={() => setDisabilityType(value)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
};

export default DisabilityPage;
