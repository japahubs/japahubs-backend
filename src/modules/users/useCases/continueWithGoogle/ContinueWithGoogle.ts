
import { ContinueWithGoogleErrors } from "./ContinueWithGoogleErrors";
import { IUserRepo } from "../../repos/userRepo";
import { UserEmail } from "../../domain/userEmail";
import { AuthProviderProfileInfo } from "../../services/authProviders/models/authProviderProfileInfo";
import { IGoogleService } from "../../services/authProviders/providers/googleProvider";
import { ContinueWithGoogleRequestDTO, ContinueWithGoogleResponseDTO } from "./ContinueWithGoogleDTO";
import { JWTToken, RefreshToken } from "../../../../shared/domain/jwt";
import { IAuthService } from "../../services/authService";
import {
  Either,
  Result,
  left,
  right,
  UseCase,
} from "../../../../shared";

type ContinueWithGoogleResponse = Either<
  ContinueWithGoogleErrors.GoogleTokenNotGenuine | 
  ContinueWithGoogleErrors.FetchAccountDetailsError, 
  Result<ContinueWithGoogleResponseDTO>
>;

// interface Request {
//   googleAuthToken: string;
//   referralCode?: string;
// }

export class ContinueWithGoogle implements UseCase<ContinueWithGoogleRequestDTO, Promise<ContinueWithGoogleResponse>> {
  
  private userRepo: IUserRepo;
  private googleService: IGoogleService;
  private authService: IAuthService;

  constructor (userRepo: IUserRepo, googleService: IGoogleService, authService: IAuthService) {
    this.userRepo =  userRepo;
    this.googleService = googleService;
    this.authService = authService;
  }
  
  async execute (request: ContinueWithGoogleRequestDTO): Promise<ContinueWithGoogleResponse> {
    let result: ContinueWithGoogleResponseDTO;
    const { googleAuthToken } = request

    const isTokenValid = await this.googleService.checkValidAuthToken(googleAuthToken);
    
    if (!isTokenValid) {
      return left(new ContinueWithGoogleErrors.GoogleTokenNotGenuine(googleAuthToken)) as ContinueWithGoogleResponse
    }

    let googleProfileInfo: AuthProviderProfileInfo;

    try {
      googleProfileInfo = await this.googleService.getProfileInfo(googleAuthToken);
    } catch (err) {
      return left(new ContinueWithGoogleErrors.FetchAccountDetailsError()) as ContinueWithGoogleResponse
    }

    const userEmail = UserEmail.create(googleProfileInfo.userEmail).getValue();

    // If the user already exists, just log 'em in.
    const alreadyCreatedUser = await this.userRepo.getUserByUserEmail(userEmail);
    
    if (alreadyCreatedUser) {
      
      const accessToken: JWTToken = this.authService.signJWT({
        userId: alreadyCreatedUser.userId.getStringValue(),
        email: alreadyCreatedUser.email.value,
        username: alreadyCreatedUser.username ? alreadyCreatedUser.username.value : "",
        role: alreadyCreatedUser.role,
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      alreadyCreatedUser.setAccessToken(accessToken, refreshToken);
      await this.authService.saveAuthenticatedUser(alreadyCreatedUser);

      result.isNew = false;
      result.accessToken = accessToken;
      result.refreshToken = refreshToken;
    } 
    
    else {
      // We're good. Create the user and save to redis cache.
      
      await this.authService.saveRegisteredUser({
        userId: null,
        googleId: googleProfileInfo.userId,
        firstName: googleProfileInfo.firstName,
        lastName: googleProfileInfo.lastName,
        email: googleProfileInfo.userEmail,
        password: null,
        avatar: googleProfileInfo.profilePictureUrl,
        isGoogleUser: true
      });

      const token = this.authService.signJWT({
        userId: "",
        email: googleProfileInfo.userEmail,
        username: "",
        role: "",
      });

      result.completeProfileToken = token;
      result.isNew = true;
    }

    return right(Result.ok<ContinueWithGoogleResponseDTO>(result)) as ContinueWithGoogleResponse; 
  }

}