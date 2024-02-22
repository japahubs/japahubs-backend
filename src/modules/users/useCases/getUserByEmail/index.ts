import { GetUserByEmail } from "./GetUserByEmail";
import { userRepo } from "../../repos";

const getUserByEmail = new GetUserByEmail(userRepo);

export { getUserByEmail };
