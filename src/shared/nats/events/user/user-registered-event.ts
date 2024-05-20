import { UniqueEntityID } from "../../../domain/UniqueEntityID";
import { Subjects } from "../subjects";
import { UserEvent } from "./user-event";

interface UserProps {
  id: UniqueEntityID;
  firstName: string;
  lastName: string;
  email: string;
}
export class UserRegisteredEvent extends UserEvent {
  public subject: Subjects.UserRegistered;

  constructor(user: UserProps) {
    super(user, Subjects.UserRegistered);
  }
}
