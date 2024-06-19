import express from "express"
import { createPostController } from "../../../useCases/post/createPost";
import { middleware } from "../../../../../shared/infra/http";
import { getUserPostsController } from "../../../useCases/post/getUserPosts";
import { getPostBySlugController } from "../../../useCases/post/getPostBySlug";
import { deletePostController } from "../../../useCases/post/deletePost";

const postRouter = express.Router();

postRouter.get('/posts',
  middleware.ensureAuthenticated(),
  (req, res) => getUserPostsController.execute(req, res)
)

postRouter.post('/posts/new',
  middleware.ensureAuthenticated(),
  (req, res) => createPostController.execute(req, res)
)

postRouter.get('/posts/:slug',
  middleware.ensureAuthenticated(),
  (req, res) => getPostBySlugController.execute(req, res)
)

postRouter.delete('/posts/:postId',
  middleware.ensureAuthenticated(),
  (req, res) => deletePostController.execute(req, res)
)

export {postRouter}