import type { PropsWithChildren } from 'react';

import OnboardingLayout from '@/pages/onboarding/components/OnboardingLayout';

interface TermsDetailLayoutPropTypes extends PropsWithChildren {
  title: string;
  onBackClick: () => void;
}

const TermsDetailLayout = ({
  title,
  onBackClick,
  children,
}: TermsDetailLayoutPropTypes) => {
  return (
    <OnboardingLayout navigationTitle={title} onBackClick={onBackClick}>
      <section className="mt-lg flex flex-1 flex-col overflow-y-auto">
        <p className="body-base-regular whitespace-pre-line text-secondary">
          {children}
        </p>
      </section>
    </OnboardingLayout>
  );
};

export default TermsDetailLayout;
