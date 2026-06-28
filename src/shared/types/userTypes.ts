export interface UserTypes {
  id: number;
  email: string;
  nickname: string;
  disability_type: string | null;
  haptic_strength: number;
  do_not_disturb: boolean;
  push_enabled: boolean;
}

export interface UpdateDoNotDisturbRequestTypes {
  do_not_disturb: boolean;
}
