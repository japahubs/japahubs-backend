import { sendEmail } from "../useCases/sendEmail";
import { UserSubscription } from "./userSubscriptions";

new UserSubscription(sendEmail);
