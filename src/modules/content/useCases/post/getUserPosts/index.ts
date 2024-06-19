
import { GetUserPosts } from "./GetUserPosts";
import { postRepo } from "../../../repos";
import { GetUserPostsController } from "./GetUserPostsController";

const getUserPosts = new GetUserPosts(postRepo);
const getUserPostsController = new GetUserPostsController(
  getUserPosts
)

export {
  getUserPosts,
  getUserPostsController
}