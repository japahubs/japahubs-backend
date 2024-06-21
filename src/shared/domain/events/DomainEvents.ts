import { IDomainEvent } from "./IDomainEvent";
import { AggregateRoot } from "../AggregateRoot";
import { UniqueEntityID } from "../UniqueEntityID";
// import {
//   userCreatedPublisher,
//   userRegisteredPublisher,
// } from "../../../modules/users/services/nats";
// import { postCreatedPublisher } from "../../../modules/content/services/nats";

export class DomainEvents {
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: IDomainEvent) =>
      this.dispatch(event)
    );
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID
  ): AggregateRoot<any>|null {
    let found: AggregateRoot<any>|null = null;
    for (let aggregate of this.markedAggregates) {
      if (aggregate.id.equals(id)) {
        found = aggregate;
      }
    }

    return found;
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  private static dispatch(event: IDomainEvent): void {
    // switch (event.constructor.name) {
    //   case "UserCreatedEvent":
    //     userCreatedPublisher.publish(event.data);
    //     break;
    //   case "UserRegisteredEvent":
    //     userRegisteredPublisher.publish(event.data);
    //     break;
    //   case "PostCreated":
    //     postCreatedPublisher.publish(event.data);
    //     break;
    //   default:
    //     console.error("Unknown event type:", event.constructor.name);
    // }
    console.info(`New domain Event:`, `[${event.constructor.name}]`);
  }
}
