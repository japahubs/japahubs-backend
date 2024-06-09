import { postRepo } from "../../repos";
import { CreatePostController } from "./CreatePostController";
import { CreatePostUseCase } from "./CreatePostUseCase";

const createPostUseCase = new CreatePostUseCase(postRepo);
const createPostController = new CreatePostController(createPostUseCase);

export { createPostController };
