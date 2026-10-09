export interface GoogleAuthRequestTypes {
  id_token: string;
}

export interface AuthTokenResponseTypes {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LogoutRequestTypes {
  refresh_token: string;
}

export type GoogleAuthResponseTypes = AuthTokenResponseTypes;
export type GuestLoginResponseTypes = AuthTokenResponseTypes;

export type LoginTypeTypes = 'guest' | 'google';
