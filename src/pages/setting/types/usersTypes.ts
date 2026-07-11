/** PATCH /users/me 요청 바디 (내 정보 수정) */
export interface UpdateUsersRequestTypes {
  nickname?: string | null;
  disability_type?: string | null;
}

/** PATCH /users/me/haptic 요청 바디 (진동 세기 수정) */
export interface UpdateHapticRequestTypes {
  haptic_strength: number;
}

/** PATCH /users/me/push-enabled 요청 바디 (푸시 알림 on/off) */
export interface UpdatePushEnabledRequestTypes {
  push_enabled: boolean;
}

/** PATCH /users/me/agreement 요청 바디 (약관 동의 수정) */
export interface UpdateAgreementRequestTypes {
  terms_agreed: boolean;
}
