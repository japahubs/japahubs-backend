import { UserEmail } from "../domain/userEmail";
import { User } from "../domain/user";
import { UserName } from "../domain/userName";
import { UserId } from "../domain/userId";

export interface IUserRepo {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUserName(userName: UserName | string): Promise<User>;
  save(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
}
