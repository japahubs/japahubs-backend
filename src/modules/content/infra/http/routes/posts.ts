import express from "express"
import { createPostController } from "../../../useCases/post/createPost";
import { middleware } from "../../../../../shared/infra/http";
import { getUserPostsController } from "../../../useCases/post/getUserPosts";
import { getAuthenticatedUserPostsController } from "../../../useCases/post/getAuthenticatedUserPosts";

const postRouter = express.Router();

postRouter.get('/posts',
  middleware.ensureAuthenticated(),
  (req, res) => getAuthenticatedUserPostsController.execute(req, res)
)

postRouter.post('/posts/new',
  middleware.ensureAuthenticated(),
  (req, res) => createPostController.execute(req, res)
)

postRouter.get('/posts/:userId',
  middleware.ensureAuthenticated(),
  (req, res) => getUserPostsController.execute(req, res)
)

export {postRouter}