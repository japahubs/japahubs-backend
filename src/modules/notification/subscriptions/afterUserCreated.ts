import { getConsumer } from "../../../shared/infra/broker/kafka/consumer";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { UserCreated } from "../../users/domain/events/userCreated";

export class AfterUserCreated implements IHandle<UserCreated> {
  private consumer;
  private cb;
  constructor(cb) {
    this.consumer = getConsumer();

    if (!this.consumer) {
      throw new Error("Failed to initialize Kafka consumer");
    }

    this.cb = cb;
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    this.consumer.connect();

    this.consumer
      .on("ready", () => {
        console.log("consumer ready for event: [user-created]...");
        this.consumer.subscribe(["user-created"]);
        this.consumer.consume();
      })
      .on("data", (data) => {
        this.cb(JSON.parse(data.value));
      });
  }
}
