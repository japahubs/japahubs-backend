import { getStream } from "../../infra/broker/kafka/producer";
import { IDomainEvent } from "./IDomainEvent";
//import eventType from "./eventType";

export class EventService {
  private static producer;

  private static initialize() {
    EventService.producer = getStream("user-created");
  }

  public static async dispatch(event: IDomainEvent) {
    EventService.initialize();

    EventService.producer.on("error", (err) => {
      console.error("Error in our kafka stream");
      console.error(err);
    });

    try {
      EventService.producer.write(Buffer.from(JSON.stringify(event.raw())));
    } catch (error) {
      console.error(`Could not dispatch event: ${event.name}`, error);
    }
  }
}
