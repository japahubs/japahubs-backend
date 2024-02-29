import { getConsumer } from "../../../shared/infra/broker/kafka/consumer";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { UserCreated } from "../../users/domain/events/userCreated";

export class UserSubscription implements IHandle<UserCreated> {
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
        console.log("user events subscription ready ✔");
        this.consumer.subscribe(["user-created", "user-registered"]);
        this.consumer.consume();
      })
      .on("data", (data) => {
        this.cb.execute(JSON.parse(data.value));
      });
  }
}
