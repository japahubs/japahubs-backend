import { PrismaUserRepo } from "../../repos/implementations/prismaUserRepo";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

const userRepo = new PrismaUserRepo();
const createUserUsecase = new CreateUserUseCase(userRepo);
const createUserController = new CreateUserController(createUserUsecase);

export { createUserController };
