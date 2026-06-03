import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const LoadingSpinner = () => {
  const [step, setStep] = useState(0);

  // . -> .. -> ... 순서로 반복
  const dots = ['.', '..', '...'];
  const currentDots = dots[step];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#11120f] from-[73.077%] relative size-full to-[#21221e]">
      {/* 글로우 애니메이션 */}
      <div className="absolute left-1/2 top-[334px] -translate-x-1/2">
        {/* 첫 번째 글로우 - 항상 표시 (.) */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[104px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 104 104"
          >
            <g>
              <circle cx="52.4575" cy="67.2876" fill="#f2b204" r="7.45752" />
              <circle cx="52.4575" cy="37.4575" fill="#f2b204" r="7.45752" />
              <circle
                cx="52"
                cy="52"
                fill="url(#paint0_radial_small)"
                fillOpacity="0.7"
                r="52"
              />
              <circle
                cx="52"
                cy="52"
                fill="url(#paint1_radial_small)"
                fillOpacity="0.7"
                r="52"
                transform="matrix(-1 0 0 1 104 3.05176e-05)"
              />
            </g>
            <defs>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="translate(78 52) rotate(180) scale(78 89.5)"
                gradientUnits="userSpaceOnUse"
                id="paint0_radial_small"
                r="1"
              >
                <stop offset="0.759615" stopColor="#FFE26E" stopOpacity="0" />
                <stop offset="1" stopColor="#FFE26E" />
              </radialGradient>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="translate(78 52) rotate(180) scale(78 89.5)"
                gradientUnits="userSpaceOnUse"
                id="paint1_radial_small"
                r="1"
              >
                <stop offset="0.759615" stopColor="#FFE26E" stopOpacity="0" />
                <stop offset="1" stopColor="#FFE26E" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* 두 번째 글로우 - .. 부터 표시 */}
        <AnimatePresence>
          {step >= 1 && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[146px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="absolute block inset-0 size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 146 146"
              >
                <g>
                  <circle
                    cx="73"
                    cy="73"
                    fill="url(#paint0_radial_medium)"
                    fillOpacity="0.45"
                    r="73"
                    transform="matrix(1 1.74846e-07 1.74846e-07 -1 3.8147e-06 146)"
                  />
                  <circle
                    cx="73"
                    cy="73"
                    fill="url(#paint1_radial_medium)"
                    fillOpacity="0.45"
                    r="73"
                    transform="matrix(-1 0 0 1 146 3.05176e-05)"
                  />
                </g>
                <defs>
                  <radialGradient
                    cx="0"
                    cy="0"
                    gradientTransform="translate(109.5 73) rotate(180) scale(109.5 125.644)"
                    gradientUnits="userSpaceOnUse"
                    id="paint0_radial_medium"
                    r="1"
                  >
                    <stop
                      offset="0.759615"
                      stopColor="#FFE26E"
                      stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#FFE26E" />
                  </radialGradient>
                  <radialGradient
                    cx="0"
                    cy="0"
                    gradientTransform="translate(109.5 73) rotate(180) scale(109.5 125.644)"
                    gradientUnits="userSpaceOnUse"
                    id="paint1_radial_medium"
                    r="1"
                  >
                    <stop
                      offset="0.759615"
                      stopColor="#FFE26E"
                      stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#FFE26E" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 세 번째 글로우 - ... 일 때만 표시 */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[198px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                className="absolute block inset-0 size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 198 198"
              >
                <g>
                  <ellipse
                    cx="99"
                    cy="99"
                    fill="url(#paint0_radial_large)"
                    fillOpacity="0.3"
                    rx="99"
                    ry="99"
                    transform="matrix(1 1.74846e-07 1.74846e-07 -1 4.10185e-06 198)"
                  />
                  <ellipse
                    cx="99"
                    cy="99"
                    fill="url(#paint1_radial_large)"
                    fillOpacity="0.3"
                    rx="99"
                    ry="99"
                    transform="rotate(180 99 99)"
                  />
                </g>
                <defs>
                  <radialGradient
                    cx="0"
                    cy="0"
                    gradientTransform="translate(148.5 99) rotate(180) scale(148.5 170.394)"
                    gradientUnits="userSpaceOnUse"
                    id="paint0_radial_large"
                    r="1"
                  >
                    <stop
                      offset="0.759615"
                      stopColor="#FFE26E"
                      stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#FFE26E" />
                  </radialGradient>
                  <radialGradient
                    cx="0"
                    cy="0"
                    gradientTransform="translate(148.5 99) rotate(180) scale(148.5 170.394)"
                    gradientUnits="userSpaceOnUse"
                    id="paint1_radial_large"
                    r="1"
                  >
                    <stop
                      offset="0.759615"
                      stopColor="#FFE26E"
                      stopOpacity="0"
                    />
                    <stop offset="1" stopColor="#FFE26E" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 로딩 텍스트 */}
      <p className="-translate-x-1/2 absolute heading-lg-semibold leading-[1.4] left-1/2 not-italic text-primary-400 text-[16px] text-center top-[496px] whitespace-nowrap">
        loading {currentDots}
      </p>
    </div>
  );
};

export default LoadingSpinner;
