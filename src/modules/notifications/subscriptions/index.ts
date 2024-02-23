import { AfterUserCreated } from "./afterUserCreated";
import { SendEmail } from "../domain/email";

// Subscriptions
new AfterUserCreated(SendEmail);
