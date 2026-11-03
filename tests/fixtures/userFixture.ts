import type { UserTypes } from '@/shared/types/userTypes';

export const USER_FIXTURE: UserTypes = {
  id: 1,
  email: 'test@example.com',
  nickname: '테스트 사용자',
  terms_agreed: true,
  disability_type: null,
  haptic_strength: 50,
  do_not_disturb: false,
  push_enabled: false,
  emergency_alert_enabled: true,
};
