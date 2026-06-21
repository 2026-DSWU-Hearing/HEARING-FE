// 프로필 수정 폼의 검증 기준과 안내 메시지 모음
export const NICKNAME_MAX_LENGTH = 10;

export const PROFILE_MESSAGE = {
  TOO_LONG_NICKNAME: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}글자까지만 가능합니다`,
} as const;
