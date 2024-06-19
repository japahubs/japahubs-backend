import { UniqueEntityID } from "../../../shared";
import { Mapper } from "../../../shared/infra/Mapper";
import { Name } from "../domain/name";
import { UserBio } from "../domain/userBio";
import { UserDP } from "../domain/userDP";
import { UserDetails, UserDetailsProps } from "../domain/userDetails";
import { UserId } from "../domain/userId";
import { UserName } from "../domain/userName";
import { UserSearchResponseDTO } from "../dtos/userDTO";


export class UserDetailsMap implements Mapper<UserDetails> {

  public static toDTO (userDetails: UserDetails): UserSearchResponseDTO {

  const  userDetailsDTO: UserSearchResponseDTO = {
    userId: userDetails.userId.getStringValue(),
    username: userDetails.username.value,
    firstName: userDetails.firstName.value,
    lastName: userDetails.lastName.value,
    avatar: userDetails.avatar.url,
    bio: userDetails.bio ? userDetails.bio.value : "",
    postCount: userDetails.postCount ? userDetails.postCount : 0,
    journalCount: userDetails.journalCount ? userDetails.journalCount : 0,
    opportunityCount: userDetails.opportunityCount ? userDetails.opportunityCount : 0
    }

    return userDetailsDTO;
  }  

  public static toDomain(raw: any): UserDetails {
  
    const userValues: UserDetailsProps = {
      userId: new UniqueEntityID(raw.id),
      username: UserName.create({ value: raw.username }).getValue(),
      firstName: Name.create({ value: raw.firstname }).getValue(),
      lastName: Name.create({ value: raw.lastname }).getValue(),
      avatar: UserDP.create({ url: raw.imageUrl }).getValue()
    };

    if (raw.bio) userValues.bio = UserBio.create({ bio: raw.bio }).getValue();
    if (raw.postCount) userValues.postCount = raw.postCount;
    if (raw.journalCount) userValues.journalCount = raw.journalCount;
    if (raw.opportunityCount) userValues.opportunityCount = raw.opportunityCount;

    const userDetailsOrError = UserDetails.create(userValues);
    
    userDetailsOrError.isFailure ? console.log(userDetailsOrError.getErrorValue()) : "";
    return userDetailsOrError.isSuccess ? userDetailsOrError.getValue() : null;
  }
}