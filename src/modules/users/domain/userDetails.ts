import { Result, ValueObject, Guard, IGuardArgument, UniqueEntityID } from "../../../shared";
import { UserEmail } from "./userEmail";
import { UserName } from "./userName";
import { UserId } from "./userId";
import { Name } from "./name";
import { ReportCategory } from "./reportCategory";
import { UserDP } from "./userDP";
import { UserBio } from "./userBio";

export interface UserDetailsProps {
  bio?: UserBio;
  avatar: UserDP;
  firstName: Name;
  lastName: Name;
  username: UserName;
  userId: UniqueEntityID
  email?: UserEmail;
  dateofbirth?: Date;
  lastActivity?:Date;
  postCount?: number;
  journalCount?: number;
  opportunityCount?: number;
  reportedBy?: string;
  reportedCategory?: ReportCategory;
  reportedDate?:Date;
  createdAt?:Date;
}

export class UserDetails extends ValueObject<UserDetailsProps> {
  get userId(): UserId {
    return UserId.create(this.props.userId).getValue();
  }

  get bio(): UserBio {
    return this.props.bio;
  }

  get avatar(): UserDP {
    return this.props.avatar;
  }

  get firstName(): Name {
    return this.props.firstName;
  }

  get lastName(): Name {
    return this.props.lastName;
  }

  get username (): UserName {
    return this.props.username;
  }

  get email (): UserEmail {
    return this.props.email;
  }

  get dateofbirth (): Date {
    return this.props.dateofbirth;
  }

  get lastActivity (): Date {
    return this.props.lastActivity;
  }
  get postCount (): number {
    return this.props.postCount;
  }

  get journalCount (): number {
    return this.props.journalCount;
  }

  get opportunityCount (): number {
    return this.props.opportunityCount;
  }

  get reportedBy (): string {
    return this.props.reportedBy;
  }

  get reportedCategory (): ReportCategory {
    return this.props.reportedCategory;
  }

  get reportedDate (): Date {
    return this.props.reportedDate;
  }

  get createdAt (): Date {
    return this.props.createdAt;
  }

  private constructor (props: UserDetailsProps) {
    super(props);
  }

  public static create (props: UserDetailsProps): Result<UserDetails> {
    const guardArgs: IGuardArgument[] = [
      { argument: props.avatar, argumentName: 'avatar' },
      { argument: props.firstName, argumentName: 'firstName' },
      { argument: props.lastName, argumentName: 'lastName' },
      { argument: props.username, argumentName: 'username' },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardArgs);

    if (guardResult.isFailure) {
      return Result.fail<UserDetails>(guardResult.getErrorValue());
    }


    return Result.ok<UserDetails>(new UserDetails({
      ...props,
    }));
  }
}