
import { has } from 'lodash'
import { IUserRepo } from "../../repos/userRepo";
import { User } from "../../domain/user";
import { WithChanges, Changes } from "../../../../shared/core/WithChanges";
import { UpdateUserInfoErrors } from "./UpdateUserInfoErrors";
import {
  Either,
  Result,
  left,
  right,
  UseCase,
  AppError,
} from "../../../../shared";
import { UserEmail } from '../../domain/userEmail';

export type EditUserResponse = Either<
UpdateUserInfoErrors.UserNotFoundError | 
  AppError.UnexpectedError | 
  Result<any>,
  Result<void>
>

interface UpdateUserInfoDTO {
    userId: string;
    email?: string;
    username?: string;
    phone?: string;
    country?: string;
    language?: string;
    gender?: string;
}

export class UpdateUserInfo implements UseCase<UpdateUserInfoDTO, Promise<EditUserResponse>>, WithChanges {
  private userRepo: IUserRepo;
  public changes: Changes;

  constructor (userRepo: IUserRepo) {
    this.userRepo = userRepo;
    this.changes = new Changes();
  }

  private updatePhone(phone: string, user: User): void {
    this.changes.addChange(user.updatePhone(phone));
  }

  private updateCountry(country: string, user: User): void {
    this.changes.addChange(user.updateCountry(country));
  }

  private updateLanguage(language: string, user: User): void {
    this.changes.addChange(user.updateLanguage(language));
  }

  private updateGender(gender: string, user: User): void {
    this.changes.addChange(user.updateGender(gender));
  }
  
  public async execute (request: UpdateUserInfoDTO): Promise<EditUserResponse> {
    let user: User;
    
    try {
      user = await this.userRepo.getUserByUserId(request.userId);
    } catch (err) {
      return left(new UpdateUserInfoErrors.UserNotFoundError(user.userId.getStringValue()))
    }
    
    // if (has(request, 'email')) this.updateEmail(request.email, user);
    // if (has(request, 'username')) this.updateUsername(request.username, user);
    if (has(request, 'phone')) this.updatePhone(request.phone, user);
    if (has(request, 'country')) this.updateCountry(request.country, user);
    if (has(request, 'language')) this.updateLanguage(request.language, user);
    if (has(request, 'gender')) this.updateGender(request.gender, user);
    
    const result = this.changes.getChangeResult();
    if (result.isFailure) {
        this.changes.clear()
        return left(new AppError.NewError(result.getErrorMessage())) as EditUserResponse;
    }

    console.log(`${user.email.value}\n${user.username.value}\n${user.phone.value}\n${user.country.value}\n${user.language.value}\n${user.gender}\n`)
    
    await this.userRepo.update(user);
    
    return right(Result.ok<void>())
  }
}
