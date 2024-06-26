import { UserEmail } from "../domain/userEmail";
import { User } from "../domain/user";
import { UserName } from "../domain/userName";
import { UserDetails } from "../domain/userDetails";

export interface IUserRepo {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User>;
  getUserByUserName(userName: UserName | string): Promise<User | null>;
  getUserByUserEmail(email: UserEmail | string): Promise<User>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(userId: string): Promise<void>;
  getGetAllUsers(page: number, limit: number, search: string): Promise<UserDetails[]>;
  deleteAccount(email:string): Promise<void>;
  saveAccount(email:string, firstName:string, userId:string): Promise<void>;
}
