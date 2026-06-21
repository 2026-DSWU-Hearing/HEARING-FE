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
