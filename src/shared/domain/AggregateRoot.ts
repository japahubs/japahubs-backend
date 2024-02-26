import { Entity } from './Entity'
import { IDomainEvent } from './events/IDomainEvent'
import { UniqueEntityID } from './UniqueEntityID'

export abstract class AggregateRoot<T> extends Entity<T> {
  get id(): UniqueEntityID {
    return this._id
  }

  protected dispatchDomainEvent(domainEvent: IDomainEvent): void {
    const eventData = domainEvent.toJSON()

    // Pass the serialized event to the Kafka producer

    // Log the domain event
    console.info(`[Domain Event Created]:`, eventData)
  }
}
