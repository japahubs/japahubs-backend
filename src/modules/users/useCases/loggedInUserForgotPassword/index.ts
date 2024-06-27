import { forgotPassword } from "../forgotPassword";
import { LoggedInUserForgotPasswordController } from "./LoggedInUserForgotPasswordController";

const loggedInUserForgotPasswordController = new LoggedInUserForgotPasswordController(forgotPassword);
export { loggedInUserForgotPasswordController, forgotPassword };
