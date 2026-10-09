// 프로필 수정 폼의 검증 기준과 안내 메시지 모음
export const NICKNAME_MAX_LENGTH = 10;

export const PROFILE_MESSAGE = {
  TOO_LONG_NICKNAME: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}글자까지만 가능합니다`,
  EMPTY_NICKNAME: '닉네임을 입력해주세요',
  SAVE_FAILED: '프로필 저장에 실패했어요.\n잠시 후 다시 시도해 주세요.',
} as const;
