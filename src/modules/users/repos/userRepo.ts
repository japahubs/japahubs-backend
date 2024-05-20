import { UserEmail } from "../domain/userEmail";
import { User } from "../domain/user";
import { UserName } from "../domain/userName";

export interface IUserRepo {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUserName(userName: UserName | string): Promise<User | null>;
  getUserByUserEmail(email: UserEmail | string): Promise<User>;
  save(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
}
