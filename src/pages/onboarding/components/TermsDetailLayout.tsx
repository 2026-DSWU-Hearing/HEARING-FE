import type { PropsWithChildren } from 'react';

import LongConfirmButton from '@/pages/onboarding/components/LongConfirmButton';
import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';
import OnboardingTopNavigation from '@/pages/onboarding/components/OnboardingTopNavigation';
import termsCheckIcon from '@/shared/assets/icons/onboarding/terms-check.svg';

interface TermsDetailLayoutPropTypes extends PropsWithChildren {
  title: string;
  onBackClick: () => void;
  onAgreeClick: () => void;
}

const TermsDetailLayout = ({
  title,
  onBackClick,
  onAgreeClick,
  children,
}: TermsDetailLayoutPropTypes) => {
  return (
    <OnboardingLayout
      topNavigation={
        <OnboardingTopNavigation
          title={title}
          titleAlign="left"
          onBackClick={onBackClick}
        />
      }
      bottomButton={
        <LongConfirmButton onClick={onAgreeClick}>
          <span className="flex items-center justify-center gap-xs">
            동의하기
            <img
              src={termsCheckIcon}
              alt=""
              className="h-icon-md w-icon-md"
              aria-hidden="true"
            />
          </span>
        </LongConfirmButton>
      }
    >
      <section className="flex flex-1 flex-col items-start gap-lg">
        <div className="tag-glass-effect mb-lg flex h-[549px] w-full flex-col items-start gap-[10px] self-stretch overflow-y-auto rounded-xl bg-neutral-900/50 p-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="body-base-medium whitespace-pre-line text-primary">
            {children}
          </p>
        </div>
      </section>
    </OnboardingLayout>
  );
};

export default TermsDetailLayout;
