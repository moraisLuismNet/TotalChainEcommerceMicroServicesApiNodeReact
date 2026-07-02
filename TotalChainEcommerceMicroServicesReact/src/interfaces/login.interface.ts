export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  email: string;
  name?: string;
  role: string;
}

export interface IUserSession {
  email: string;
  name?: string;
  token: string;
  role: string;
}
