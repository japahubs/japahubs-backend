import { prismaClient } from "../../../shared/infra/persistence"
import { PrismaUserRepo } from "./implementations/prismaUserRepo";

const userRepo = new PrismaUserRepo(prismaClient);

export { userRepo };
