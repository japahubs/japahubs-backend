import { UserEmail } from "./userEmail";
import { UserName } from "./userName";
import { UserId } from "./userId";
import { UserPassword } from "./userPassword";
import { UserPhone } from "./userPhone";
import { Name } from "./name";
import { UserBio } from "./userBio";
import { UserDP } from "./userDP";
import { Gender } from "./gender";
import { Role } from "./role";
import { SocialLink } from "./socialLink";
import { Country } from "./country";
import { Language } from "./language";
import { UniqueEntityID, Result, Guard, AggregateRoot } from "../../../shared";
import { JWTToken, RefreshToken } from "../../../shared/domain/jwt";

export interface UserProps {
  username?: UserName;
  bio?: UserBio;
  avatar?: UserDP;
  phone?: UserPhone;
  firstName: Name;
  lastName: Name;
  gender?: Gender;
  country?: Country;
  language: Language;
  email: UserEmail;
  dateOfBirth?: Date;
  active?: boolean;
  reported?: boolean;
  deactivated?: boolean;
  lastActivity?: Date;
  postCount?: number;
  journalCount?: number;
  opportunityCount?: number;
  links?: SocialLink[];
  password: UserPassword;
  role: Role;
  accessToken?: JWTToken;
  refreshToken?: RefreshToken;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt?: Date;
  googleId?: number;
}

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get username() {
    return this.props.username;
  }

  get bio() {
    return this.props.bio;
  }

  get avatar() {
    return this.props.avatar;
  }

  get phone() {
    return this.props.phone;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get gender() {
    return this.props.gender;
  }

  get country() {
    return this.props.country;
  }

  get language() {
    return this.props.language;
  }

  get email() {
    return this.props.email;
  }

  get dateOfBirth() {
    return this.props.dateOfBirth;
  }

  get links() {
    return this.props.links;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  get active() {
    return this.props.active;
  }

  get reported() {
    return this.props.reported;
  }

  get deactivated() {
    return this.props.deactivated;
  }

  get lastActivity() {
    return this.props.lastActivity;
  }

  get postCount() {
    return this.props.postCount;
  }

  get journalCount() {
    return this.props.journalCount;
  }

  get opportunityCount() {
    return this.props.opportunityCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get accessToken() {
    return this.props.accessToken;
  }

  get lastLogin() {
    return this.props.lastLogin;
  }

  get refreshToken() {
    return this.props.refreshToken;
  }

  get googleId () {
    return this.props.googleId;
  }

  public isLoggedIn(): boolean {
    return !!this.props.accessToken && !!this.props.refreshToken;
  }

  public setAccessToken(token: JWTToken, refreshToken: RefreshToken): void {
    this.props.accessToken = token;
    this.props.refreshToken = refreshToken;
    this.props.lastLogin = new Date();

    //dispatch Event: UserLoggedIn
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: UserProps,
    isRegister: boolean = false,
    id?: UniqueEntityID
  ): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.firstName, argumentName: "firstName" },
      { argument: props.lastName, argumentName: "lastName" },
      { argument: props.email, argumentName: "email" },
    ]);

    if (guardResult.isFailure) {
      return Result.fail<User>(guardResult.getErrorValue());
    }

    const isNewUser = !!id === false;
    const user = new User(
      {
        ...props,
      },
      id
    );

    const eventData = {
      id: user.id,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      email: user.email.value,
      createdAt: user.createdAt
    };

    // if (!isRegister && isNewUser) {
    //   user.addDomainEvent(new UserCreatedEvent({...eventData, username: user.username!.value, dateofbirth: user.dateOfBirth!}));
    // }
    // if (isRegister) {
    //   user.addDomainEvent(new UserRegisteredEvent(eventData));
    // }

    return Result.ok<User>(user);
  }
}
