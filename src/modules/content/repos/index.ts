import { prismaClient } from "../../../shared/infra/persistence"
import { PrismaPostRepo } from "./implementations/prismaPostRepo";

const postRepo = new PrismaPostRepo(prismaClient);

export { postRepo };
