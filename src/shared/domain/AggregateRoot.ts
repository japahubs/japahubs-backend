import { Entity } from "./Entity";
import { EventService } from "./events/EventService";
import { IDomainEvent } from "./events/IDomainEvent";
import { UniqueEntityID } from "./UniqueEntityID";

export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueEntityID {
    return this._id;
  }

  protected dispatchDomainEvent(domainEvent: IDomainEvent): void {
    EventService.dispatch(domainEvent);
    console.info(`[Domain Event Created]:`, domainEvent.name);
  }
}
