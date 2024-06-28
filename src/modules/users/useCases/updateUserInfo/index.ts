import { UpdateUserInfo } from "./UpdateUserInfo";
import { UpdateUserInfoController } from "./UpdateUserInfoController";
import { userRepo } from "../../repos";

const updateUserInfoUsecase = new UpdateUserInfo(userRepo);
const updateUserInfoController = new UpdateUserInfoController(updateUserInfoUsecase);

export { updateUserInfoController };
