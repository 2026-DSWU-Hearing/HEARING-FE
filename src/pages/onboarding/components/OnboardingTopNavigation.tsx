import TopNavigation from '@/layout/TopNavigation';
import backArrowIcon from '@/shared/assets/icons/onboarding/back-arow.svg';

interface OnboardingTopNavigationPropTypes {
  title?: string;
  titleAlign?: 'center' | 'left';
  onBackClick: () => void;
}

const OnboardingTopNavigation = ({
  title = '',
  titleAlign = 'center',
  onBackClick,
}: OnboardingTopNavigationPropTypes) => {
  return (
    <TopNavigation
      title={title}
      titleAlign={titleAlign}
      backIconSrc={backArrowIcon}
      onBackClick={onBackClick}
    />
  );
};

export default OnboardingTopNavigation;
