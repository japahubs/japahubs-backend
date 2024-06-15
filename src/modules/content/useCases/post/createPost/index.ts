import { userRepo } from "../../../../users/repos";
import { postRepo } from "../../../repos";
import { CreatePostController } from "./CreatePostController";
import { CreatePostUseCase } from "./CreatePostUseCase";

const createPostUseCase = new CreatePostUseCase(postRepo, userRepo);
const createPostController = new CreatePostController(createPostUseCase);

export { createPostController, createPostUseCase };
