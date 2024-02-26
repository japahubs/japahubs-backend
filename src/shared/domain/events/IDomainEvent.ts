import { UniqueEntityID } from '../UniqueEntityID'

export interface IDomainEvent {
  dateTimeOccurred: Date
  getAggregateId(): UniqueEntityID
  toJSON(): Record<string, unknown>
}
