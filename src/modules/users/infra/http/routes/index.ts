import express from "express";
import { createUserController } from "../../../useCases/createUser";
import { loginController } from "../../../useCases/login";
import { middleware } from "../../../../../shared/infra/http";
import { registerUserController } from "../../../useCases/register";
import { refreshAccessTokenController } from "../../../useCases/refreshAccessToken";
import { logoutController } from "../../../useCases/logout";
import { getAllUsersController } from "../../../useCases/getAllUsers";
import { continueWithGoogleController } from "../../../useCases/continueWithGoogle";
import { deleteUserController } from "../../../useCases/deleteUser";
import { getUserProfileController } from "../../../useCases/getUserProfile";
import { editUserProfileController } from "../../../useCases/editUserProfile";
import { updateUserInfoController } from "../../../useCases/updateUserInfo";

const userRouter = express.Router();

userRouter.get('/docs', (req, res) => {
  res.redirect(302, 'https://documenter.getpostman.com/view/24186009/2sA2r9Vi6E');
});

userRouter.post("/auth/register", (req, res) =>
  registerUserController.execute(req, res)
);

userRouter.post("/auth/complete-register", (req, res) =>
  createUserController.execute(req, res)
);

// userRouter.post("/auth/resend-verification", (req, res) =>
//   resendVerificationEmailController.execute(req, res)
// );

userRouter.post("/auth/login", (req, res) =>
  loginController.execute(req, res)
);

userRouter.post("/auth/continue-with-google", (req, res) =>
  continueWithGoogleController.execute(req, res)
);

// userRouter.post("/auth/forgot-password", (req, res) =>
//   forgotPasswordController.execute(req, res)
// );

// userRouter.post("/auth/resend-forgot-password", (req, res) =>
//   resendForgotPasswordEmailController.execute(req, res)
// );

// userRouter.post("/auth/reset-password", (req, res) =>
//   resetPasswordController.execute(req, res)
// );

userRouter.get("/auth/token/refresh", (req, res) =>
  refreshAccessTokenController.execute(req, res)
);

userRouter.post("/auth/logout", middleware.ensureAuthenticated(), (req, res) =>
  logoutController.execute(req, res)
);

userRouter.get("/users", middleware.ensureAuthenticated(), (req, res) =>
  getAllUsersController.execute(req, res)
);

userRouter.get("/users/profile/:username", middleware.ensureAuthenticated(), (req, res) =>
  getUserProfileController.execute(req, res)
);

userRouter.put("/users/profile", middleware.ensureAuthenticated(), (req, res) =>
  editUserProfileController.execute(req, res)
);

userRouter.put("/users/profile/settings", middleware.ensureAuthenticated(), (req, res) =>
  updateUserInfoController.execute(req, res)
);

userRouter.delete('/users/:userId',
  middleware.ensureAuthenticated(),
  (req, res) => deleteUserController.execute(req, res)
)


export { userRouter };
