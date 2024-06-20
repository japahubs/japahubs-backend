
import { prisma } from "../../../shared/infra/persistence";
import { PrismaUserRepo } from "./implementations/prismaUserRepo";

const userRepo = new PrismaUserRepo(prisma);

export { userRepo };
