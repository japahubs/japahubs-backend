import { IUserRepo } from "../userRepo";
import { UserName } from "../../domain/userName";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { UserEmail } from "../../domain/userEmail";
//import { PrismaClient } from "@prisma/client";
import { dispatchEventsCallback } from "../../../../shared/infra/persistence/hooks";
import { UserDetails } from "../../domain/userDetails";
import { UserDetailsMap } from "../../mappers/userDetailsMap"
import { PrismaClientWithPulse } from "../../../../shared/infra/persistence";

export class PrismaUserRepo implements IUserRepo {
  private prisma: PrismaClientWithPulse;

  constructor(prismaClient: PrismaClientWithPulse) {
    this.prisma = prismaClient;
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
    if (exists) {
      const rawUser = await UserMap.toPersistence(user);
      await this.prisma.users.update({
        where: { email: user.email.value },
        data: rawUser,
      });
    }
    else {
      const rawUser = await UserMap.toPersistence(user);
      const item = await this.prisma.users.create({
        data: rawUser,
      });
      //dispatchEventsCallback(item.id);
    }
  }

  async delete(userId: string): Promise<void> {
    await this.prisma.users.delete({
      where: {
        id: userId,
      },
    });
  }
  async deleteAccount(email: string): Promise<void> {
    await this.prisma.account.delete({
      where: {
        email,
      },
    });
  }

  async saveAccount(email: string, firstName:string, userId: string): Promise<void> {
    try {
      await this.prisma.account.upsert({
        where: { email },
        update: { id: userId, firstname:firstName }, 
        create: { id: userId, email, firstname:firstName },
      });
    } catch (error) {
     console.error("Error saving account:", error); 
    }
    }
  
  async getGetAllUsers(page: number, limit: number, search: string = ""): Promise<UserDetails[]> {
    
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
        imageUrl: true,
        firstname: true,
        lastname: true,
        username: true,
        bio: true,
        postCount: true,
        journalCount: true,
        opportunityCount: true,
      },
      where: {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { firstname: { contains: search, mode: "insensitive" } },
          { lastname: { contains: search, mode: "insensitive" } },
          { bio: { contains: search, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });;

    return users.map((user) => UserDetailsMap.toDomain(user))
  }
}
