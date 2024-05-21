import { NatsConnection, JSONCodec } from "nats";
import { Streams } from "./streams";
import { Subjects } from "./subjects";
import { addStream } from "./helpers/add-stream";
import { IDomainEvent } from "../../domain/events/IDomainEvent";

// interface Event {
//   stream: Streams;
//   subject: Subjects;
//   data: any;
// }

export abstract class Publisher<T extends IDomainEvent> {
  abstract stream: T["stream"];
  abstract subject: T["subject"];
  private natsConnection: NatsConnection;

  constructor(natsConnection: NatsConnection) {
    this.natsConnection = natsConnection;
  }

  async publish(data: T["data"]): Promise<void> {
    // create a codec
    const jc = JSONCodec();
    const jsm = await this.natsConnection.jetstreamManager();
    try {
      // check if stream exists
      await jsm.streams.info(this.stream);
    } catch (err) {
      if (err.code === "404") {
        // stream not found, so add it
        await addStream(jsm, this.stream);
      } else {
        console.log("Problem getting stream info");
      }
    }
    const jetStreamClient = this.natsConnection.jetstream();
    try {
      await jetStreamClient.publish(this.subject, jc.encode(data));
      
    } catch (reason) {
      console.error(reason);
    }
  }
}
