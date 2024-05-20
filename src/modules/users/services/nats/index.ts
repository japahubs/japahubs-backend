import { startNats } from "../../../../shared/infra/broker/nats/startNats";
import { NatsWrapper } from "../../../../shared/infra/broker/nats/nats-wrapper";
import { UserCreatedPublisher } from "./publishers/user-created-publisher";
import { UserRegisteredPublisher } from "./publishers/user-registered-publisher";

//const natsWrapper = new NatsWrapper("users module");

let userCreatedPublisher: UserCreatedPublisher;
let userRegisteredPublisher: UserRegisteredPublisher;

async function setupPublishers() {
  //await startNats(natsWrapper);
  const client = await startNats("users module");

  userCreatedPublisher = new UserCreatedPublisher(client);
  userRegisteredPublisher = new UserRegisteredPublisher(client);
}

setupPublishers();

export { userCreatedPublisher, userRegisteredPublisher };
