import { Listener, Streams, Subjects } from "../../../../shared/nats";
import { JsMsg } from "nats";
import { queueGroupName } from "../queue-group-name";
import { UserEvent } from "src/shared/nats/events/user/user-event";
import { sendEmail } from "../../useCases/sendEmail";

export class UserListener extends Listener<UserEvent> {
  stream: Streams.User = Streams.User;
  subject = "user.event";
  queueGroupName: string = queueGroupName;

  async onMessage(data: UserEvent["data"], msg: JsMsg) {
    console.log(data);

    switch (data.type) {
      case "user.registered":
      case "user.created":
      case "user.forgotpassword":
        sendEmail.execute(data);
        break;
      default:
        console.log("Unhandled event type:", data.type);
    }

    msg.ack();
  }
}
