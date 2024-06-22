import  { prisma } from "../../../shared/infra/persistence"
import { sendEmail } from "../useCases/sendEmail";

class UserSubscription {
  
  constructor() {
    this.start(); 
  }

  private async start() {
    const stream = await prisma.users.stream({ name: "user-stream" });

    process.on('exit', (code) => {
      stream.stop()
    })

    for await (const event of stream) {
      console.log(`New event: user.${event.action}d`);
      let user = {}; 
      if (event.action === "create"){
        user = {
            userId: event.created.id,
            email: event.created.email,
            firstName: event.created.firstname,
            lastName: event.created.lastname
        }
      }
      const data = {
        type: `user.${event.action}d`,
        timestamp: new Date().toISOString(),
        data: user,
      }
      switch (event.action) {
        case "create":
          sendEmail.execute(data);
          break;
        case "update":
          // Handle update event 
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

export { UserSubscription };
