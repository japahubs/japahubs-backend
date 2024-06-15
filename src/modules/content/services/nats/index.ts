import { startNats } from "../../../../shared/infra/broker/nats/startNats";
import { PostCreatedPublisher } from "./publishers/postCreatedPublisher";


let postCreatedPublisher: PostCreatedPublisher;

async function setupPublishers() {
  const client = (await startNats("content module"))!;
  postCreatedPublisher = new PostCreatedPublisher(client);
}

setupPublishers();

export { postCreatedPublisher };
