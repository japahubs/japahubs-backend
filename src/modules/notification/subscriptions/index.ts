import { sendEmail } from "../useCases/sendEmail";
import { AfterUserCreated } from "./afterUserCreated";

// Subscriptions
new AfterUserCreated(sendEmail);
