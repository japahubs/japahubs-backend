import { UniqueEntityID } from "../../../domain/UniqueEntityID";
import { Subjects } from "../subjects";
import { UserEvent } from "./user-event";

interface UserProps {
  id: UniqueEntityID;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateofbirth: Date;
  createdAt: Date
}

export class UserCreatedEvent extends UserEvent {
  public subject!: Subjects.UserCreated;

  constructor(user: UserProps) {
    super(user, Subjects.UserCreated);
  }
}
