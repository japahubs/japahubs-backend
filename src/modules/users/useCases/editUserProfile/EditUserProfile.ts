
import { has } from 'lodash'
import { IUserRepo } from "../../repos/userRepo";
import { User } from "../../domain/user";
import { WithChanges, Changes } from "../../../../shared/core/WithChanges";
import { EditUserProfileErrors } from "./EditUserProfileErrors";
import {
  Either,
  Result,
  left,
  right,
  UseCase,
  AppError,
} from "../../../../shared";

export type EditUserResponse = Either<
  EditUserProfileErrors.UserNotFoundError | 
  AppError.UnexpectedError | 
  Result<any>,
  Result<void>
>

interface EditUserDTO {
    userId: string;
    bio?: string;
    avatar?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    links?: string[];
}

export class EditUserProfile implements UseCase<EditUserDTO, Promise<EditUserResponse>>, WithChanges {
  private userRepo: IUserRepo;
  public changes: Changes;

  constructor (userRepo: IUserRepo) {
    this.userRepo = userRepo;
    this.changes = new Changes();
  }

  private updateBio (bio: string, user: User) : void {
    this.changes.addChange(user.updateBio(bio));   
  }

  private updateAvatar(avatar: string, user: User): void {
    this.changes.addChange(user.updateAvatar(avatar));
  }

  private updateFirstName(firstName: string, user: User): void {
    this.changes.addChange(user.updateFirstName(firstName));
  }

  private updateLastName(lastName: string, user: User): void {
    this.changes.addChange(user.updateLastName(lastName));
  }

  private updateLinks(links: string | string[], user: User): void {
    this.changes.addChange(user.updateLinks(links));
  }

  private updateDateOfBirth(dob: string, user: User): void {
    this.changes.addChange(user.updateDateOfBirth(dob));
  }
  
  public async execute (request: EditUserDTO): Promise<EditUserResponse> {
    let user: User;
    
    try {
      user = await this.userRepo.getUserByUserId(request.userId);
    } catch (err) {
      return left(new EditUserProfileErrors.UserNotFoundError(user.userId.getStringValue()))
    }
    
    if (has(request, 'bio')) this.updateBio(request.bio, user);
    if (has(request, 'avatar')) this.updateAvatar(request.avatar, user);
    if (has(request, 'firstName')) this.updateFirstName(request.firstName, user);
    if (has(request, 'lastName')) this.updateLastName(request.lastName, user);
    if (has(request, 'dateOfBirth')) this.updateDateOfBirth(request.dateOfBirth, user);
    if (has(request, 'links')) this.updateLinks(request.links, user);
    
    const result = this.changes.getChangeResult();
    if (result.isFailure) {
        this.changes.clear()
        return left(new AppError.NewError(result.getErrorMessage())) as EditUserResponse;
    }
    
    await this.userRepo.save(user);
    
    return right(Result.ok<void>())
  }
}
