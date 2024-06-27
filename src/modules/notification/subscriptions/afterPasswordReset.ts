import { User } from "../../users/domain/user";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { PasswordReset } from "../../users/domain/events/passwordReset";
import { SendEmail } from "../useCases/sendEmail/SendEmail";

export class AfterPasswordReset implements IHandle<PasswordReset> {
  private sendEmail: SendEmail;

  constructor (sendEmail: SendEmail) {
    this.setupSubscriptions();
    this.sendEmail = sendEmail;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onPasswordReset.bind(this), PasswordReset.name);
  }

  private async onPasswordReset (event: PasswordReset): Promise<void> {
    
    const data = {
        type: `user.passwordreset`,
        timestamp: new Date().toISOString(),
        data: {
            userId: event.user.userId.getStringValue(),
            email: event.user.email.value,
            firstName: event.user.firstName.value,
            lastName: event.user.lastName.value
        },
      }

    try {
      await this.sendEmail.execute(data)
      console.log(`[AfterPasswordReset]: Successfully executed SendEmail usecase AfterPasswordReset`)
    } catch (err) {
      console.log(`[AfterPasswordReset]: Failed to execute SendEmail usecase AfterPasswordReset.`)
    }
    
  }
}