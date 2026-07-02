import type { ComponentType, SVGProps } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DisabilityOptionButton from '@/pages/onboarding/components/DisabilityOptionButton';
import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import DeafIcon from '@/shared/components/icons/onboarding/DeafIcon';
import HohIcon from '@/shared/components/icons/onboarding/HohIcon';

type DisabilityType = 'deaf' | 'hardOfHearing';

const DISABILITY_OPTIONS = [
  { label: '농인', value: 'deaf', Icon: DeafIcon },
  { label: '난청인', value: 'hardOfHearing', Icon: HohIcon },
] satisfies {
  label: string;
  value: DisabilityType;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[];

const DisabilityPage = () => {
  const navigate = useNavigate();
  const [selectedDisabilityType, setSelectedDisabilityType] =
    useState<DisabilityType | null>(null);

  const isNextButtonDisabled = selectedDisabilityType === null;

  const handleNextButtonClick = () => {
    if (isNextButtonDisabled) return;

    navigate('/onboarding/terms');
  };

  return (
    <OnboardingLayout
      title={'장애 유형을\n선택해주세요.'}
      onBackClick={() => navigate('/onboarding/nickname')}
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
            isSelected={selectedDisabilityType === value}
            onClick={() => setSelectedDisabilityType(value)}
          />
        ))}
      </div>
    </OnboardingLayout>
  );
};

export default DisabilityPage;
