import express from "express"
import { createPostController } from "src/modules/posts/useCases/createPost";
import { middleware } from "src/shared/infra/http";

const postRouter = express.Router();

postRouter.post("/posts", middleware.ensureAuthenticated(), (req, res) => createPostController.execute(req,res))

export {postRouter}