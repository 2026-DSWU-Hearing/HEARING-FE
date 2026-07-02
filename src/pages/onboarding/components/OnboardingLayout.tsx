import type { PropsWithChildren, ReactNode } from 'react';

import TopNavigation from '@/layout/TopNavigation';
import backArrowIcon from '@/shared/assets/icons/onboarding/back-arow.svg';

interface OnboardingLayoutPropTypes extends PropsWithChildren {
  title?: string;
  navigationTitle?: string;
  onBackClick: () => void;
  bottomButton?: ReactNode;
}

const OnboardingLayout = ({
  title,
  navigationTitle = '',
  onBackClick,
  bottomButton,
  children,
}: OnboardingLayoutPropTypes) => {
  return (
    <main className="flex min-h-dvh w-full justify-center bg-neutral-950 text-primary">
      <section className="inline-flex min-h-dvh w-full flex-col bg-neutral-950 px-base pb-[98px]">
        <TopNavigation
          title={navigationTitle}
          backIconSrc={backArrowIcon}
          onBackClick={onBackClick}
        />

        <div className="flex flex-1 flex-col">
          {title && (
            <h1 className="heading-4xl-semibold whitespace-pre-line text-primary">
              {title}
            </h1>
          )}

          {children}
        </div>

        {bottomButton}
      </section>
    </main>
  );
};

export default OnboardingLayout;
