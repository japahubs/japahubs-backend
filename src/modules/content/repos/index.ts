import { prisma } from "../../../shared/infra/persistence"
import { PrismaPostRepo } from "./implementations/prismaPostRepo";

const postRepo = new PrismaPostRepo(prisma);

export { postRepo };
