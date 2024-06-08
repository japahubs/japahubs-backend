import { IDomainEvent } from "../../domain/events/IDomainEvent";
import {
  JsMsg,
  NatsConnection,
  JSONCodec,
  consumerOpts,
  AckPolicy,
  DeliverPolicy,
  NatsError,
} from "nats";
import { Streams } from "./streams";
import { Subjects } from "./subjects";
import { addStream } from "./helpers/add-stream";

export abstract class Listener<T extends IDomainEvent> {
  abstract stream: T["stream"];
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;
  private natsConnection: NatsConnection;
  protected ackWait: number = 30 * 1000 * 1000 * 1000; // 30 secs in nanosecs

  constructor(natsConnection: NatsConnection) {
    this.natsConnection = natsConnection;
  }

  async listen(): Promise<void> {
    try {
      const jsm = await this.natsConnection.jetstreamManager();

      try {
        // Check if stream exists
        await jsm.streams.info(this.stream);
      } catch (e) {
        const err = e as NatsError
        if (err.code === "404") {
          // add a stream
          await addStream(jsm, this.stream);
        } else {
          console.log("Problem getting stream info");
        }
      }

      const name = `q-${this.queueGroupName}-stream-user`;
      const consumers = await jsm.consumers.list(this.stream).next();

      consumers.forEach(async (ci) => {
        await jsm.consumers.delete(this.stream, ci.name);
      });

      const nameExists = consumers.some((ci) => ci.name === name);

      if (!nameExists) {
        await jsm.consumers.add(this.stream, {
          durable_name: name,
          deliver_group: this.queueGroupName,
          //deliver_subject: this.subject,
          ack_policy: AckPolicy.Explicit,
          ack_wait: this.ackWait,
          deliver_policy: DeliverPolicy.All,
          name,
        });
      }

      // Print a list of all consumers for the sttream
      console.log(await jsm.consumers.list(this.stream).next());
      // purge all messages in the stream
      await jsm.streams.purge(this.stream);

      const jetStreamClient = this.natsConnection.jetstream();
      try {
        const jc = JSONCodec();
        const consumer = await jetStreamClient.consumers.get(this.stream);

        while (true) {
          console.log(`waiting for messages...`);
          const messages = await consumer.consume();
          try {
            for await (const msg of messages) {
              console.log(
                `Received message from subject ${msg.subject} in the sequence: ${msg.seq}`
              );
              this.onMessage(jc.decode(msg.data), msg);
              msg.ack();
              //await jsm.streams.deleteMessage(this.stream, msg.seq);
            }
          } catch (err) {
            console.log(`consume failed: ${(err as Error).message}`);
          }
        }
      } catch (err) {
        console.error("Error subscribing to JetStream:", err);
      }
    } catch (error) {
      console.error("Error in listen:", error);
    }
  }
}
