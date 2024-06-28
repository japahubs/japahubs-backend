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
import { UniqueEntityID, Result, Guard, AggregateRoot, Either, left, right } from "../../../shared";
import { JWTToken, RefreshToken } from "../../../shared/domain/jwt";
import { dispatchEventsCallback } from "../../../shared/infra/persistence/hooks";

type UpdateUserResult<T> = Result<T | void>;

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
  followerCount?: number;
  followingCount?: number;
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

  get followerCount() {
    return this.props.followerCount;
  }

  get followingCount() {
    return this.props.followingCount;
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

  public updatePassword (password: UserPassword): UpdateUserResult<UserBio> {
    this.props.password = password;
    dispatchEventsCallback(this.userId.getStringValue());
    return Result.ok<void>();
  }

  public updateBio (bio: string): UpdateUserResult<UserBio> {
    const bioOrError = UserBio.create({ bio }); 
    if (bioOrError.isFailure) {
      return Result.fail<UserBio>(bioOrError.getErrorMessage())
    } 
    this.props.bio = bioOrError.getValue();
    return Result.ok<void>();
  }

  public updateAvatar (avatar: string): UpdateUserResult<UserDP> {
    const avatarOrError = UserDP.create({ url: avatar }); 
    if (avatarOrError.isFailure) {
      return avatarOrError
    } 
    this.props.avatar = avatarOrError.getValue();
    return Result.ok<void>();
  }

  public updateFirstName (firstName: string): UpdateUserResult<Name> {
    const firstNameOrError = Name.create({ value: firstName });
    if (firstNameOrError.isFailure) {
      return Result.fail<Name>(firstNameOrError.getErrorMessage())
    } 
    this.props.firstName = firstNameOrError.getValue();
    return Result.ok<void>();
  }

  public updateLastName (lastName: string): UpdateUserResult<Name> {
    const lastNameOrError = Name.create({ value: lastName }); 
    if (lastNameOrError.isFailure) {
      return Result.fail<Name>(lastNameOrError.getErrorMessage())
    } 
    this.props.lastName = lastNameOrError.getValue();
    return Result.ok<void>();
  }

  public updateDateOfBirth(dob: string): UpdateUserResult<any> {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dob)) {
      return Result.fail<any>("Invalid date format. Please use YYYY-MM-DD");
    }
    const dateOfBirth = new Date(dob);

    const today = new Date();
    const birthYear = dateOfBirth.getFullYear();
    const age = today.getFullYear() - birthYear - ((today.getMonth() === dateOfBirth.getMonth()) && (today.getDate() < dateOfBirth.getDate()) ? 1 : 0);
    if (age < 16) {
      return Result.fail<any>("User must be at least 16 years old");
    }
    this.props.dateOfBirth = dateOfBirth;
    return Result.ok<void>();
  }
  
  public updateLinks(links: string | string[]): UpdateUserResult<SocialLink> {
    if (typeof links === 'string') {
      const linkOrError = SocialLink.create({ url: links });
      if (linkOrError.isFailure) {
        return Result.fail<SocialLink>(linkOrError.getErrorMessage());
      }
  
      this.props.links = [linkOrError.getValue()];
      return Result.ok<void>();
    } else {
      if (Array.isArray(links)) {
        const updatedLinks:SocialLink[] = [];
        for (const link of links) {
          const linkOrError = SocialLink.create({ url: link });
          if (linkOrError.isFailure) {
            return Result.fail<SocialLink>(linkOrError.getErrorMessage());
          }
          updatedLinks.push(linkOrError.getValue());
        }
  
        this.props.links = updatedLinks;
        this.props.links = updatedLinks;
        return Result.ok<void>();
      }
    }
  }

  public updatePhone (phone: string): UpdateUserResult<UserPhone> {
    const phoneOrError = UserPhone.create({ value:phone }); 
    if (phoneOrError.isFailure) {
      return Result.fail<UserPhone>(phoneOrError.getErrorMessage())
    } 
    this.props.phone = phoneOrError.getValue();
    return Result.ok<void>();
  }

  public updateCountry (country: string): UpdateUserResult<Country> {
    const countryOrError = Country.create({ value: country }); 
    if (countryOrError.isFailure) {
      return Result.fail<Country>(countryOrError.getErrorMessage())
    } 
    this.props.country = countryOrError.getValue();
    return Result.ok<void>();
  }

  public updateLanguage (language: string): UpdateUserResult<Language> {
    const languageOrError = Language.create({ value:language }); 
    if (languageOrError.isFailure) {
      return Result.fail<Language>(languageOrError.getErrorMessage())
    } 
    this.props.language = languageOrError.getValue();
    return Result.ok<void>();
  }

  public updateGender (gender: string): UpdateUserResult<any> {
    if (!(gender === "Male") && !(gender === "Female")) {
      return Result.fail<any>("Unrecognized gender")
    } 
    const userGender: Gender = gender as Gender;
    this.props.gender = userGender;
    return Result.ok<void>();
  }

  public updateEmail (email: string): UpdateUserResult<UserEmail> {
    const emailOrError = UserEmail.create(email); 
    if (emailOrError.isFailure) {
      return Result.fail<UserEmail>(emailOrError.getErrorMessage())
    } 
    this.props.email = emailOrError.getValue();
    return Result.ok<void>();
  }
  
  public updateUsername (username: string): UpdateUserResult<UserBio> {
    const usernameOrError = UserName.create({ value:username }); 
    if (usernameOrError.isFailure) {
      return Result.fail<UserBio>(usernameOrError.getErrorMessage())
    } 
    this.props.username = usernameOrError.getValue();
    return Result.ok<void>();
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
