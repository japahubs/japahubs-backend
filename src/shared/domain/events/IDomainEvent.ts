import { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent {
  dateTimeOccurred: Date;
  name: string;
  getAggregateId(): UniqueEntityID;
  raw(): {};
}
