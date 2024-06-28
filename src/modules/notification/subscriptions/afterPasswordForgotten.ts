import { User } from "../../users/domain/user";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { PasswordForgotten } from "../../users/domain/events/passwordForgotten";
import { SendEmail } from "../useCases/sendEmail/SendEmail";

export class AfterPasswordForgotten implements IHandle<PasswordForgotten> {
  private sendEmail: SendEmail;

  constructor (sendEmail: SendEmail) {
    this.setupSubscriptions();
    this.sendEmail = sendEmail;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(this.onPasswordForgotten.bind(this), PasswordForgotten.name);
  }

  private async onPasswordForgotten (event: PasswordForgotten): Promise<void> {
    
    const data = {
        type: `user.passwordforgotten`,
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
      console.log(`[AfterPasswordForgotten]: Successfully executed SendEmail usecase AfterPasswordForgotten`)
    } catch (err) {
      console.log(`[AfterPasswordForgotten]: Failed to execute SendEmail usecase AfterPasswordForgotten.`)
    }
    
  }
}