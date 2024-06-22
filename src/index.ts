import { config } from "./shared/config/appConfig.shared";
import { userRouter } from "./modules/users/infra/http/routes";
import { notificationRouter } from "./modules/notification/infra/http/routes";
import { chatRouter } from "./modules/chat/infra/http/routes";

import { WebServer } from "./shared/infra/http/webServer";
import "./modules/notification/subscriptions";
import { postRouter } from "./modules/content/infra/http/routes";

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err);
    process.exit(1);
  });

const server = new WebServer(config.api, [userRouter, notificationRouter, chatRouter, postRouter]);
server.start();

process.on("unhandledRejection", async (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err);
    await server.stop();
    process.exit(1);
  });
  
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.stop();
    console.log("💥 Process terminated!");
  });