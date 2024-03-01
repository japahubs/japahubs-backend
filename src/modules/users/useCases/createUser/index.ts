import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const createUserUsecase = new CreateUserUseCase(userRepo, authService);
const createUserController = new CreateUserController(createUserUsecase);

export { createUserController };
