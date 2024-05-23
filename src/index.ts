import { userRouter } from "./modules/users/infra/http/routes";
import { config } from "./shared/config/appConfig.shared";
import { WebServer } from "./shared/infra/http/webServer";
import "./modules/notification/subscriptions";
import { notificationRouter } from "./modules/notification/infra/http/routes";

new WebServer({ port: config.api.port }, [userRouter, notificationRouter]).start();
