import express from "express"
import { createPostController } from "../../../useCases/post/createPost";
import { middleware } from "../../../../../shared/infra/http";

const postRouter = express.Router();

postRouter.post('/posts/new',
  middleware.ensureAuthenticated(),
  (req, res) => createPostController.execute(req, res)
)

export {postRouter}