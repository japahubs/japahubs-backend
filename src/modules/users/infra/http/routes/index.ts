import express from "express";
import { createUserController } from "../../../useCases/createUser";
import { loginController } from "../../../useCases/login";

const userRouter = express.Router();

userRouter.post("/users/new", (req, res) =>
  createUserController.execute(req, res)
);

userRouter.post("/users/login", (req, res) =>
  loginController.execute(req, res)
);

export { userRouter };
