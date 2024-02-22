import { User } from "../user";
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";

export class UserCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public type = "user-created";
  public user: User;

  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }

  raw(): any {
    return {
      type: this.type,
      timestamp: this.dateTimeOccurred.toISOString(),
      data: {
        userId: this.user.id.toString(),
        firstName: this.user.firstName.value,
        lastName: this.user.lastName.value,
        email: this.user.email.value,
        password: this.user.password.getHashedValue(),
      },
    };
  }
}
