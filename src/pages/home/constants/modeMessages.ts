import { MAX_MODE_NAME_LENGTH } from '@/pages/home/components/modeForm/ModeFormContext';

// 모드 생성/수정 폼의 검증 및 안내 메시지 모음
export const MODE_MESSAGE = {
  EMPTY_NAME: '모드 이름을 입력해주세요',
  TOO_LONG_NAME: `모드 이름은 ${MAX_MODE_NAME_LENGTH}글자 이하로 입력해주세요`,
  EMPTY_SOUND: '소리를 1개 이상 선택해주세요',
  DUPLICATED_NAME: '이미 사용 중인 모드 이름입니다',
  MAX_MODE_COUNT: '모드는 최대 6개까지 만들 수 있습니다',
  MIN_MODE_COUNT: '모드는 최소 1개 이상 유지해야 합니다',
  MIN_SOUND_COUNT: '소리는 최소 1개 이상 유지해야 합니다',
  DELETE_CONFIRM: '정말 삭제하시겠습니까?',
  // 활성 모드 삭제 시: 어떤 모드로 전환되는지 명시하고 삭제할지 안내 (현재/다음 모드 이름 동적 삽입)
  ACTIVE_DELETE_CONFIRM: (currentModeName: string, nextModeName: string) =>
    `현재 '${currentModeName}' 모드가 활성화되어 있습니다.\n'${nextModeName}' 모드로 전환 후 삭제하시겠습니까?`,
  // 다른 모드 활성화는 성공했지만 현재 모드 삭제가 실패했을 때의 부분 성공 안내
  ACTIVE_DELETE_PARTIAL_FAIL:
    '다른 모드로 전환은 되었지만 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요',
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
