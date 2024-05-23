import { sendEmail } from "../sendEmail";
import {AdminSendMailController} from "./AdminSendMailController"

const adminSendMailController = new AdminSendMailController(sendEmail);

export { adminSendMailController };
