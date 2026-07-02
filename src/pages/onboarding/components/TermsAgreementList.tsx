import rightArrowIcon from '@/shared/assets/icons/onboarding/right-arrow.svg';

export type AgreementId = 'service' | 'privacy' | 'sensitive' | 'notification';

export interface AgreementItemTypes {
  id: AgreementId;
  label: string;
  isRequired: boolean;
  detailPath: string;
}

interface TermsAgreementListPropTypes {
  agreements: AgreementItemTypes[];
  checkedAgreements: Record<AgreementId, boolean>;
  onAgreementToggle: (id: AgreementId) => void;
  onDetailClick: (path: string) => void;
}

const TermsAgreementList = ({
  agreements,
  checkedAgreements,
  onAgreementToggle,
  onDetailClick,
}: TermsAgreementListPropTypes) => {
  return (
    <ul className="flex w-full flex-col items-start gap-base self-stretch px-sm">
      {agreements.map(({ id, label, isRequired, detailPath }) => {
        const isChecked = checkedAgreements[id];

        return (
          <li key={id} className="flex w-full items-center gap-xs">
            <button
              type="button"
              onClick={() => onAgreementToggle(id)}
              aria-pressed={isChecked}
              className="flex flex-1 items-center gap-xs text-left"
            >
              <span
                className="
    flex h-[20px] w-[20px] shrink-0 items-center justify-center
    rounded-[12px] border border-disabled bg-neutral-200 p-[4px]
  "
                aria-hidden="true"
              >
                {isChecked && (
                  <span className="block aspect-square h-[12px] w-[12px] shrink-0 rounded-full bg-[#DF9A00]" />
                )}
              </span>

              <span className="heading-base-semibold text-secondary">
                <span
                  className={isRequired ? 'text-primary-500' : 'text-secondary'}
                >
                  [{isRequired ? '필수' : '선택'}]
                </span>
                <span className="ml-[4px]">{label}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onDetailClick(detailPath)}
              aria-label={`${label} 안내 페이지로 이동`}
              className="flex h-icon-md w-icon-md shrink-0 items-center justify-center"
            >
              <img src={rightArrowIcon} alt="" className="h-full w-full" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default TermsAgreementList;
