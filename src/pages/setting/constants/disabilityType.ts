/**
 * 장애 유형(disability_type) 상수와 한글 라벨 매핑.
 * 서버와는 코드값(HARD_OF_HEARING / DEAF)으로 주고받고, 화면에는 한글 라벨을 보여준다.
 * TODO(api): 실제 서버 스펙(코드값)이 확정되면 값만 맞춰 수정한다.
 */
export const DISABILITY_TYPE = {
  HARD_OF_HEARING: 'HARD_OF_HEARING',
  DEAF: 'DEAF',
} as const;

export type DisabilityTypeTypes =
  (typeof DISABILITY_TYPE)[keyof typeof DISABILITY_TYPE];

export const DISABILITY_TYPE_LABEL: Record<DisabilityTypeTypes, string> = {
  [DISABILITY_TYPE.HARD_OF_HEARING]: '난청인',
  [DISABILITY_TYPE.DEAF]: '농인',
};

/** 프로필 수정 페이지의 장애 유형 선택 목록 렌더에 사용한다. */
export const DISABILITY_TYPE_OPTIONS: {
  value: DisabilityTypeTypes;
  label: string;
}[] = [
  { value: DISABILITY_TYPE.HARD_OF_HEARING, label: '난청인' },
  { value: DISABILITY_TYPE.DEAF, label: '농인' },
];

/** 장애 유형 미설정 시 화면에 표시할 라벨. */
const UNSET_DISABILITY_LABEL = '미설정';

/**
 * 서버 코드값(string | null)을 화면 union 타입으로 안전하게 좁힌다.
 * 알려진 코드값이 아니면 null을 반환한다. (`as` 단언은 이 함수 안에만 둔다)
 */
export const toDisabilityType = (
  value: string | null,
): DisabilityTypeTypes | null => {
  const isKnownType = (
    Object.values(DISABILITY_TYPE) as string[]
  ).includes(value ?? '');

  return isKnownType ? (value as DisabilityTypeTypes) : null;
};

/** 서버 코드값을 한글 라벨로 변환한다. 미설정·미지원 값은 '미설정'으로 표시한다. */
export const getDisabilityLabel = (value: string | null): string => {
  const disabilityType = toDisabilityType(value);

  return disabilityType !== null
    ? DISABILITY_TYPE_LABEL[disabilityType]
    : UNSET_DISABILITY_LABEL;
};
