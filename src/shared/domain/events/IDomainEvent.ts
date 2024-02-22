import { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent {
  dateTimeOccurred: Date;
  type: string;
  getAggregateId(): UniqueEntityID;
  raw(): {};
}
