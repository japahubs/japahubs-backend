
import { GetUserPosts } from "../getUserPosts/GetUserPosts";
import { postRepo } from "../../../repos";
import { GetAuthenticatedUserPostsController } from "./GetAuthenticatedUserPostsController";

const getUserPosts = new GetUserPosts(postRepo);
const getAuthenticatedUserPostsController = new GetAuthenticatedUserPostsController(
  getUserPosts
)

export {
  getAuthenticatedUserPostsController
}