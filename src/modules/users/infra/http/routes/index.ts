import express from "express";
import { createUserController } from "../../../useCases/createUser";
import { loginController } from "../../../useCases/login";
import { getAuthenticatedUserController } from "../../../useCases/getAuthenticatedUser";
import { middleware } from "../../../../../shared/infra/http";
import { registerUserController } from "../../../useCases/register";

const userRouter = express.Router();

userRouter.post("/users/new", (req, res) =>
  registerUserController.execute(req, res)
);

userRouter.post("/users/login", (req, res) =>
  loginController.execute(req, res)
);

userRouter.post("/users/complete-profile", (req, res) =>
  createUserController.execute(req, res)
);

userRouter.get("/users/me", middleware.ensureAuthenticated(), (req, res) =>
  getAuthenticatedUserController.execute(req, res)
);

export { userRouter };
