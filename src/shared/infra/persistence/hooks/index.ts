import { UniqueEntityID } from "../../../domain/UniqueEntityID";
import { DomainEvents } from "../../../domain/events/DomainEvents";

export const dispatchEventsCallback = (primaryKeyField: string | null) => {
  if (primaryKeyField !== null) {
    const aggregateId = new UniqueEntityID(primaryKeyField);
    DomainEvents.dispatchEventsForAggregate(aggregateId);
  }
};
