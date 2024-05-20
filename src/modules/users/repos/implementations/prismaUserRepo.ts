import { IUserRepo } from "../userRepo";
import { UserName } from "../../domain/userName";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";
import { PrismaClient } from "@prisma/client";
import { dispatchEventsCallback } from "../../../../shared/infra/persistence/hooks";

export class PrismaUserRepo implements IUserRepo {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const user = await this.prisma.users.findFirst({
      where: {
        email: userEmail.value,
      },
    });
    return !!user;
  }

  async getUserByUserName(userName: UserName | string): Promise<User | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        username: userName instanceof UserName ? userName.value : userName,
      },
    });
    // if (!user) throw new Error("User not found.");
    if (!user) return null;
    return UserMap.toDomain(user);
  }

  async getUserByUserEmail(email: UserEmail | string): Promise<User> {
    const user = await this.prisma.users.findFirst({
      where: {
        email: email instanceof UserEmail ? email.value : email,
      },
    });
    if (!user) throw new Error("User not found.");
    return UserMap.toDomain(user);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const user = await this.prisma.users.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error("User not found.");
    return UserMap.toDomain(user);
  }

  async save(user: User): Promise<void> {
    const exists = await this.exists(user.email);
    if (!exists) {
      const rawUser = await UserMap.toPersistence(user);
      const item = await this.prisma.users.create({
        data: rawUser,
      });
      dispatchEventsCallback(item.id);
    }
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.users.delete({
      where: {
        id: userId,
      },
    });
  }
}
