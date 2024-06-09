import { PrismaClient } from "@prisma/client";
import { IPostRepo } from "../postRepo";

export class PrismaPostRepo implements IPostRepo {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }
}