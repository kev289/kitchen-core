export interface ILoginResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: {
    readonly name: string;
    readonly email: string;
  };
}