import { sendEmail } from "../useCases/sendEmail";
import { AccountSubscription } from "./accountStream";
import { AfterPasswordForgotten } from "./afterPasswordForgotten";
import { UserSubscription } from "./userStream";

new UserSubscription();
new AccountSubscription();
new AfterPasswordForgotten(sendEmail);