import express from "express"
import { uploadImageController } from "src/modules/uploads/useCases/uploadImage";
import { middleware } from "src/shared/infra/http";

const uploadsRouter = express.Router();

uploadsRouter.post("/uploads/url", middleware.ensureAuthenticated(), (req, res) => uploadImageController.execute(req,res))

export {uploadsRouter}