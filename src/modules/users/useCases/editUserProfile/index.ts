import { EditUserProfile } from "./EditUserProfile";
import { EditUserProfileController } from "./EditUserProfileController";
import { userRepo } from "../../repos";

const editUserProfileUsecase = new EditUserProfile(userRepo);
const editUserProfileController = new EditUserProfileController(editUserProfileUsecase);

export { editUserProfileController };
