
export interface ContinueWithGoogleResponseDTO {
  completeProfileToken?: string;
  isNew: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface ContinueWithGoogleRequestDTO {
    googleAuthToken: string;
  }