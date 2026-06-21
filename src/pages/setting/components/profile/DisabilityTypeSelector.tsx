import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import {
  DISABILITY_TYPE_OPTIONS,
  type DisabilityTypeTypes,
} from '@/pages/setting/constants/disabilityType';

interface DisabilityTypeSelectorPropTypes {
  value: DisabilityTypeTypes;
  onChange: (value: DisabilityTypeTypes) => void;
}

const DisabilityTypeSelector = ({
  value,
  onChange,
}: DisabilityTypeSelectorPropTypes) => {
  return (
    <section className="flex flex-col gap-xs">
      <h2 className="heading-base-semibold text-secondary">장애 유형</h2>

      <ul className="overflow-hidden rounded-lg bg-neutral-900">
        {DISABILITY_TYPE_OPTIONS.map((option, index) => {
          const isSelected = value === option.value;

          return (
            <li key={option.value}>
              {/* 첫 항목을 제외하고 위쪽 구분선을 둔다. */}
              <button
                type="button"
                onClick={() => onChange(option.value)}
                aria-pressed={isSelected}
                className={`flex w-full items-center justify-between px-[1.25rem] py-[1.03rem] ${
                  index > 0 ? 'border-t border-neutral-800' : ''
                }`}
              >
                <span className="body-lg-regular text-primary">
                  {option.label}
                </span>

                {isSelected && (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-[1.5rem] text-primary"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default DisabilityTypeSelector;
