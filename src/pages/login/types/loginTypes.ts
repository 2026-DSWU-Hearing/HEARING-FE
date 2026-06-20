export interface LoginFormTypes {
  email: string;
  password: string;
}

export interface GoogleAuthRequestTypes {
  id_token: string;
}

export interface GoogleAuthResponseTypes {
  access_token: string;
  refresh_token: string;
}
