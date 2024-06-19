import { IDomainEvent, UniqueEntityID } from "../../../";
import { Streams } from "../streams";

interface UserProps {
  id: UniqueEntityID;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  dateofbirth?: Date;
  createdAt?: Date
}

export class UserEvent implements IDomainEvent {
  public stream:Streams.User = Streams.User;
  public subject: string;
  public dateTimeOccurred: Date;
  public user: UserProps;
  public data: any;

  constructor(user: UserProps, subject: string) {
    this.dateTimeOccurred = new Date();
    this.user = user;
    this.subject = subject;

    const userdata: any = {
      userId: this.user.id.toString(),
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
    }

    if (this.user.username) userdata.username = this.user.username
    if (this.user.dateofbirth) userdata.dateofbirth = this.user.dateofbirth.toISOString()
    if (this.user.createdAt) userdata.createdAt = this.user.createdAt.toISOString()

    this.data = {
      type: this.subject,
      timestamp: this.dateTimeOccurred.toISOString(),
      data: userdata,
    };
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id;
  }

  //   raw(): any {
  //     return {
  //       type: this.subject,
  //       timestamp: this.dateTimeOccurred.toISOString(),
  //       data: {
  //         userId: this.user.id.toString(),
  //         firstName: this.user.firstName,
  //         lastName: this.user.lastName,
  //         email: this.user.email,
  //       },
  //     };
  //   }
}
