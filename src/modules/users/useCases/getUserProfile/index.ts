import { GetUserProfileController } from "./GetUserProfileController";
import { getUserByUsername } from "../getUserByUsername";

const getUserProfileController = new GetUserProfileController(
  getUserByUsername
);

export { getUserProfileController };
