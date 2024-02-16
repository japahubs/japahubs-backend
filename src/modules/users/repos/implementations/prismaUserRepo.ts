import { IUserRepo } from "../userRepo";
import { UserName } from "../../domain/userName";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";
import { PrismaClient } from "@prisma/client";
import { UserId } from "../../domain/userId";

export class PrismaUserRepo implements IUserRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: userEmail.value,
      },
    });
    return !!user;
  }

  async getUserByUserName(userName: UserName | string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        username:
          userName instanceof UserName ? (<UserName>userName).value : userName,
      },
    });
    if (!user) throw new Error("User not found.");
    return UserMap.toDomain(user);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userId,
      },
    });
    if (!user) throw new Error("User not found.");
    return UserMap.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const exists = await this.exists(user.email);
    if (!exists) {
      const rawUser = await UserMap.toPersistence(user);
      await this.prisma.user.create({
        data: rawUser,
      });
    }
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        user_id: userId,
      },
    });
  }
}
