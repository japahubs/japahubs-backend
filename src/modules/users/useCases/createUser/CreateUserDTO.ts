export interface CreateUserDTO {
  username: string;
  dateOfBirth: string;
  token: string;
}

export interface LoginDTOResponse {
  isGoogleUser: boolean
  accessToken: string;
  refreshToken: string;
}
