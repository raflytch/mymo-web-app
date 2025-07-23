export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IVerifyOtp {
  email: string;
  code: string;
}

export interface IResendOtp {
  email: string;
}

export interface IUpdateUser {
  name?: string;
  avatar?: string;
}

export interface IUserResponse {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  createdAt: Date;
}

export interface IJWTPayload {
  userId: string;
  email: string;
}

export interface IApiResponse<T = unknown> {
  status: number;
  data?: T;
  message: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
}

export interface IGoogleUser {
  email: string;
  name: string;
  avatar?: string;
  googleId: string;
}

export interface IUploadResponse {
  url: string;
  fileName: string;
}
