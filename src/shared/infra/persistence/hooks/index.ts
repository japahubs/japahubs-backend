import { UniqueEntityID } from "../../../domain/UniqueEntityID";
import { DomainEvents } from "../../../domain/events/DomainEvents";

export const dispatchEventsCallback = (primaryKeyField: string) => {
  const aggregateId = new UniqueEntityID(primaryKeyField);
  DomainEvents.dispatchEventsForAggregate(aggregateId);
};
