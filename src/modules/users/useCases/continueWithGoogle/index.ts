
import { ContinueWithGoogle } from "./ContinueWithGoogle";
import { ContinueWithGoogleController } from "./ContinueWithGoogleController";
import { userRepo } from "../../repos";
import { googleService } from "../../services/authProviders";
import { authService } from "../../services";

const continueWithGoogle = new ContinueWithGoogle(userRepo, googleService, authService);
const continueWithGoogleController = new ContinueWithGoogleController(
  continueWithGoogle
)

export {
  continueWithGoogle,
  continueWithGoogleController
}