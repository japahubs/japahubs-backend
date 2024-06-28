import { LoggedInUserResetPassword } from "./LoggedInUserResetPassword";
import { LoggedInUserResetPasswordController } from "./LoggedInUserResetPasswordController";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const loggedInUserResetPassword = new LoggedInUserResetPassword(userRepo, authService);
const loggedInUserResetPasswordController = new LoggedInUserResetPasswordController(loggedInUserResetPassword);

export { loggedInUserResetPasswordController };
