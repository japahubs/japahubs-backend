import { ForgotPassword } from "./ForgotPassword";
import { ForgotPasswordController } from "./ForgotPasswordController";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const forgotPassword = new ForgotPassword(userRepo, authService);
const forgotPasswordController = new ForgotPasswordController(forgotPassword);

export { forgotPasswordController, forgotPassword };
