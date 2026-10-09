import type { PropsWithChildren, ReactNode } from 'react';

interface OnboardingLayoutPropTypes extends PropsWithChildren {
  title?: string;
  
  topNavigation: ReactNode;
  bottomButton?: ReactNode;
}

const OnboardingLayout = ({
  title,
  topNavigation,
  bottomButton,
  children,
}: OnboardingLayoutPropTypes) => {
  return (
    <main className="flex min-h-dvh w-full justify-center bg-neutral-950 text-primary">
      <section className="inline-flex min-h-dvh w-full flex-col bg-neutral-950 pb-[98px]">
        {topNavigation}

        <div className="flex flex-1 flex-col px-base">
          {title && (
            <h1 className="heading-4xl-semibold whitespace-pre-line text-primary">
              {title}
            </h1>
          )}

          {children}
        </div>

        {bottomButton && <div className="px-base">{bottomButton}</div>}
      </section>
    </main>
  );
};

export default OnboardingLayout;
