
import { GetAllUsers } from "./GetAllUsers";
import { userRepo } from "../../repos";
import { GetAllUsersController } from "./GetAllUsersController";

const getAllUsers = new GetAllUsers(userRepo);
const getAllUsersController = new GetAllUsersController(
  getAllUsers
)

export {
  getAllUsers,
  getAllUsersController
}