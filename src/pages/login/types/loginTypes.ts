export interface GoogleAuthRequestTypes {
  id_token: string;
}

export interface AuthTokenResponseTypes {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type GoogleAuthResponseTypes = AuthTokenResponseTypes;
export type GuestLoginResponseTypes = AuthTokenResponseTypes;
