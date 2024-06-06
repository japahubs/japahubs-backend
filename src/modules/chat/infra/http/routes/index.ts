import express from "express";

import {
  getAllConversations,
  newConversation,
  readConversation,
} from "../../../controllers/conversationsController";
import { deleteMessage, getMessagesInConversation, newMessage } from "../../../controllers/messagesController";
import { middleware } from "../../../../../shared/infra/http";

const chatRouter = express.Router();

chatRouter.post("/chat/conversations/new", middleware.ensureAuthenticated(), newConversation);

chatRouter.get("/chat/conversations/:userId", middleware.ensureAuthenticated(), getAllConversations);

chatRouter.put("/chat/conversations/:conversationId/read", middleware.ensureAuthenticated(), readConversation);

chatRouter.post("/chat/messages/new", middleware.ensureAuthenticated(), newMessage);
chatRouter.get("/chat/messages/", middleware.ensureAuthenticated(), getMessagesInConversation);
chatRouter.route("/chat/messages/:id")
  .delete(middleware.ensureAuthenticated(), deleteMessage);


export { chatRouter };
