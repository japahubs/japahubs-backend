import { RegisterUserController } from "./RegisterUserController";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { authService } from "../../services";
import { userRepo } from "../../repos";

const registerUserUsecase = new RegisterUserUseCase(userRepo, authService);
const registerUserController = new RegisterUserController(registerUserUsecase);

export { registerUserController };
