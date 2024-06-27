import { ResetPassword } from "./ResetPassword";
import { ResetPasswordController } from "./ResetPasswordController";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const resetPassword = new ResetPassword(userRepo, authService);
const resetPasswordController = new ResetPasswordController(resetPassword);

export { resetPasswordController, resetPassword };
