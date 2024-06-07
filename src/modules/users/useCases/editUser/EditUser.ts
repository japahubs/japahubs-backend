
// import { has } from 'lodash'
// import { IUserRepo } from "../../repos/userRepo";
// import { User } from "../../domain/user";
// import { WithChanges, Changes } from "../../../../shared/core/WithChanges";
// import { EditUserErrors } from "./EditUserErrors";
// import { UserBio } from '../../domain/userBio';
// import { UserDP } from '../../domain/userDP';
// import { UserPhone } from '../../domain/userPhone';
// import { Name } from '../../domain/name';
// import { Gender } from '../../domain/gender';
// import { Country } from '../../domain/country';
// import { Language } from '../../domain/language';
// import { SocialLink } from '../../domain/socialLink';
// import {
//   Either,
//   Result,
//   left,
//   right,
//   UseCase,
//   AppError,
// } from "../../../../shared";

// export type EditUserResponse = Either<
//   EditUserErrors.UserNotFoundError | 
//   AppError.UnexpectedError | 
//   Result<any>,
//   Result<void>
// >

// interface EditUserDTO {
//   userId: string
//   bio?: string;
//   avatar?: string;
//   phone?: string;
//   firstName?: string;
//   lastName?: string;
//   gender?: string;
//   country?: string;
//   language?: string;
//   links?: string[];
// }

// export class EditUser implements UseCase<EditUserDTO, Promise<EditUserResponse>>, WithChanges {
//   private userRepo: IUserRepo;
//   public changes: Changes;

//   constructor (userRepo: IUserRepo) {
//     this.userRepo = userRepo;
//     this.changes = new Changes();
//   }

//   private updateBio (bio: string, user: User) : void {
//       const bioOrError = UserBio.create({ bio });

//     if (bioOrError.isSuccess) this.changes.addChange(user.updateBio(bioOrError.getValue()).value);   
//   }

//   private updateAvatar(avatar: string, user: User): void {
//     const avatarOrError = UserDP.create({ url: avatar });
//     if (avatarOrError.isSuccess) this.changes.addChange(user.updateAvatar(avatarOrError.getValue()).value);
//   }

//   private updatePhone(phone: string, user: User): void {
//     const phoneOrError = UserPhone.create({ value: phone });
//     if (phoneOrError.isSuccess) this.changes.addChange(user.updatePhone(phoneOrError.getValue()).value);
//   }

//   private updateFirstName(firstName: string, user: User): void {
//     const firstNameOrError = Name.create({ value: firstName });
//     if (firstNameOrError.isSuccess) this.changes.addChange(user.updateFirstName(firstNameOrError.getValue()).value);
//   }

//   private updateLastName(lastName: string, user: User): void {
//     const lastNameOrError = Name.create({ value: lastName });
//     if (lastNameOrError.isSuccess) this.changes.addChange(user.updateLastName(lastNameOrError.getValue()).value);
//   }

//   private updateGender(gender: string, user: User): void {
//     const genderOrError = gender as Gender;
//     this.changes.addChange(user.updateGender(genderOrError).value);
//   }

//   private updateCountry(country: string, user: User): void {
//     const countryOrError = Country.create({ value: country });
//     if (countryOrError.isSuccess) this.changes.addChange(user.updateCountry(countryOrError.getValue()).value);
//   }

//   private updateLanguage(language: string, user: User): void {
//     const languageOrError = Language.create({ value: language });
//     if (languageOrError.isSuccess) this.changes.addChange(user.updateLanguage(languageOrError.getValue()).value);
//   }

//   private updateLinks(links: string[], user: User): void {
//     const linksOrError = links.map((link) => SocialLink.create({ url: link }));
//     const result = Result.combine(linksOrError)
//     if (result.isFailure) {
//       return
//     }
//     let socialLinks: SocialLink[], i: number;
//     for(i = 0; i < links.length; i++){
//       const link = SocialLink.create({ url: links[i] }).getValue();
//       socialLinks.push(link)
//     }
//     this.changes.addChange(user.updateLinks(socialLinks).value);
//   }
  
//   public async execute (request: EditUserDTO): Promise<EditUserResponse> {
//     let user: User;
    
//     try {
//       user = await this.userRepo.getUserByUserId(request.userId);
//     } catch (err) {
//       return left(new EditUserErrors.UserNotFoundError(user.userId.getStringValue()))
//     }

//     if (has(request, 'bio')) this.updateBio(request.bio, user);
//     if (has(request, 'avatar')) this.updateAvatar(request.avatar, user);
//     if (has(request, 'phone')) this.updatePhone(request.phone, user);
//     if (has(request, 'firstName')) this.updateFirstName(request.firstName, user);
//     if (has(request, 'lastName')) this.updateLastName(request.lastName, user);
//     if (has(request, 'gender')) this.updateGender(request.gender, user);
//     if (has(request, 'country')) this.updateCountry(request.country, user);
//     if (has(request, 'language')) this.updateLanguage(request.language, user);
//     if (has(request, 'links')) this.updateLinks(request.links, user);


//     const result = this.changes.getChangeResult();
//     if (result.isFailure) {
//       return left(Result.fail<any>(result.getErrorValue()));
//     }
  
//     await this.userRepo.save(user);
   
//     return right(Result.ok<void>())
//   }
// }
