import  { prisma } from "../../../shared/infra/persistence"
import { sendEmail } from "../useCases/sendEmail";

class AccountSubscription {
  
  constructor() {
    this.start(); 
  }

  private async start() {
    const stream = await prisma.account.stream({ name: "account-stream" });

    for await (const event of stream) {
      console.log(`New event: user.registered`);
      let user = {}; 
      if (event.action === "update"){
        user = {
            userId: event.after.id,
            email: event.after.email,
            firstName: event.after.firstname
        }
      }
      if (event.action === "create"){
        user = {
            userId: event.created.id,
            email: event.created.email,
            firstName: event.created.firstname
        }
      }
      const data = {
        type: "user.registered",
        timestamp: new Date().toISOString(),
        data: user,
      }
      switch (event.action) {
        case "create":
        case "update":
            sendEmail.execute(data);
          break;
        case "delete":
          // Handle delete event 
          break;
        default:
          console.log("Unhandled event type:", event);
      }

    }
  }
}

export { AccountSubscription };
