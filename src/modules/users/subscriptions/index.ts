import { AfterUserCreated } from "./afterUserCreated";
import { SendEmail } from "./sendEmail";

// Subscriptions
new AfterUserCreated(SendEmail);
