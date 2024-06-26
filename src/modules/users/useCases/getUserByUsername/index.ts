import { GetUserByUsername } from "./GetUserByUsername";
import { userRepo } from "../../repos";

const getUserByUsername = new GetUserByUsername(userRepo);

export { getUserByUsername };
