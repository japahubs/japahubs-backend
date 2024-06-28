import { Mapper } from "../../../shared/infra/Mapper";
import { User, UserProps } from "../domain/user";
import { UserDTO } from "../dtos/userDTO";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { UserName } from "../domain/userName";
import { UserPassword } from "../domain/userPassword";
import { UserEmail } from "../domain/userEmail";
import { UserBio } from "../domain/userBio";
import { Country } from "../domain/country";
import { Language } from "../domain/language";
import { Name } from "../domain/name";
import { SocialLink } from "../domain/socialLink";
import { UserDP } from "../domain/userDP";
import { UserPhone } from "../domain/userPhone";
import { Role } from "../domain/role";

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      userId: user.userId.getStringValue(),
      username: user.username ? user.username.value : "",
      bio: user.bio ? user.bio.value : "",
      avatar: user.avatar ? user.avatar.url : "",
      phone: user.phone ? user.phone.value : "",
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      gender: user.gender ? user.gender : "",
      country: user.country ? user.country.value : "",
      language: user.language.value,
      email: user.email.value,
      dateOfBirth: user.dateOfBirth
        ? user.dateOfBirth.toISOString().substring(0, 10)
        : "",
      links: user.links ? user.links.map((link) => link.url) : [],
      role: user.role,
      followerCount: user.followerCount || 0,
      followingCount: user.followingCount || 0,
      postCount: user.postCount || 0,
      journalCount: user.journalCount || 0,
      opportunityCount: user.opportunityCount || 0,
    };
  }

  public static toDomain(raw: any):User {
    const passwordOrError = UserPassword.create({
      value: raw.password,
      hashed: true,
    });

    const usernameOrError = UserName.create({ value: raw.username });
    const firstNameOrError = Name.create({ value: raw.firstname });
    const lastNameOrError = Name.create({ value: raw.lastname });
    const languageOrError = Language.create({ value: raw.language });
    const emailOrError = UserEmail.createFromRaw({ value: raw.email });
    const avatarOrError = UserDP.create({ url: raw.imageUrl });
    const role: Role = raw.role;
    const createdAt = raw.created_at;
    const updatedAt = raw.updated_at;

    const userValues: UserProps = {
      username: usernameOrError.getValue(),
      firstName: firstNameOrError.getValue(),
      lastName: lastNameOrError.getValue(),
      email: emailOrError.getValue(),
      password: passwordOrError.getValue(),
      language: languageOrError.getValue(),
      avatar: avatarOrError.getValue(),
      dateOfBirth: new Date(raw.dateofbirth),
      role,
      createdAt,
      updatedAt,
    };

    if (raw.bio) userValues.bio = UserBio.create({ bio: raw.bio }).getValue();
    if (raw.phone) userValues.phone = UserPhone.create({ value: raw.phone }).getValue();
    if (raw.gender) userValues.gender = raw.gender;
    if (raw.country)
      userValues.country = Country.create({ value: raw.country }).getValue();
    if (raw.links)
      userValues.links = raw.links.map((link:string) =>
        SocialLink.create({ url: link }).getValue()
      );

    const userOrError = User.create(
      userValues,
      false,
      new UniqueEntityID(raw.id)
    );

    return userOrError.getValue()
  }

  public static async toPersistence(user: User): Promise<any> {
    let password: string|null = null;
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    const raw: any = {
      id: user.userId.getStringValue(),
      firstname: user.firstName.value,
      lastname: user.lastName.value,
      language: user.language.value,
      email: user.email.value,
      password: password,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };

    if (user.username) raw.username = user.username.value;
    if (user.bio) raw.bio = user.bio.value;
    if (user.avatar) raw.imageUrl = user.avatar.url;
    if (user.phone) raw.phone = user.phone.value;
    if (user.gender) raw.gender = user.gender;
    if (user.country) raw.country = user.country.value;
    if (user.dateOfBirth) raw.dateofbirth = user.dateOfBirth;
    if (user.active) raw.active = user.active;
    if (user.reported) raw.reported = user.reported;
    if (user.deactivated) raw.deactivated = user.deactivated;
    if (user.lastActivity) raw.lastActivity = user.lastActivity;
    if (user.postCount) raw.postCount = user.postCount;
    if (user.journalCount) raw.journalCount = user.journalCount;
    if (user.opportunityCount) raw.opportunityCount = user.opportunityCount;
    if (user.links) raw.links = user.links.map((link) => link.url);
    if (user.googleId) raw.googleId = user.googleId;

    return raw;
  }
}
