
import { DeletePostUseCase } from "./DeletePostUseCase";
import { DeletePostController } from "./DeletePostController";
import { postRepo } from "../../../repos";

const deletePostUseCase = new DeletePostUseCase(postRepo);
const deletePostController = new DeletePostController(
  deletePostUseCase
);

export { deletePostUseCase, deletePostController };