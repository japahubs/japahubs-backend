import { GetAuthenticatedUserController } from "./GetAuthenticatedUserController";
import { getUserByEmail } from "../getUserByEmail";

const getAuthenticatedUserController = new GetAuthenticatedUserController(
  getUserByEmail
);

export { getAuthenticatedUserController };
