import { UniqueEntityID } from "../UniqueEntityID";

export interface IDomainEvent {
  dateTimeOccurred: Date;
  stream: string;
  subject: string;
  data: any;
  getAggregateId(): UniqueEntityID;
  // raw(): {};
}
// import { UniqueEntityID } from "../UniqueEntityID";

// export interface IDomainEvent {
//   dateTimeOccurred: Date;
//   type: string;
//   getAggregateId(): UniqueEntityID;
//   raw(): {};
// }
