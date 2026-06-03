import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';

// 모드 생성/수정 폼의 검증 및 안내 메시지 모음
export const MODE_MESSAGE = {
  EMPTY_NAME: '모드 이름을 입력해주세요',
  TOO_LONG_NAME: `모드 이름은 ${MAX_MODE_NAME_LENGTH}글자 이하로 입력해주세요`,
  EMPTY_SOUND: '소리를 1개 이상 선택해주세요',
  MAX_MODE_COUNT: '모드는 최대 6개까지 만들 수 있습니다',
  MIN_MODE_COUNT: '모드는 최소 1개 이상 유지해야 합니다',
  DELETE_CONFIRM: '정말 삭제하시겠습니까?',
} as const;

// 서버 응답 상태에 따른 에러 메시지
export const MODE_CREATE_ERROR_MESSAGE = {
  BAD_REQUEST: '모드 이름과 소리를 다시 확인해주세요',
  CONFLICT: '이미 사용 중인 모드 이름입니다',
  DEFAULT: '새 모드를 저장하지 못했습니다',
} as const;

export const MODE_EDIT_ERROR_MESSAGE = {
  BAD_REQUEST: '입력한 모드 정보를 다시 확인해주세요',
  NOT_FOUND: '존재하지 않는 모드입니다',
  CONFLICT: '이미 사용 중인 모드 이름입니다',
  DEFAULT: '모드 설정을 처리하지 못했습니다',
} as const;
