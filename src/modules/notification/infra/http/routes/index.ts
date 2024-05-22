import express from "express";
import { adminSendMailController } from "../../../useCases/adminSendMail";

const notificationRouter = express.Router();

notificationRouter.post("/notifications/sendmail", (req, res) =>
  adminSendMailController.execute(req, res)
);


export { notificationRouter };
