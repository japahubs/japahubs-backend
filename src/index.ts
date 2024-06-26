import { config } from "./shared/config/appConfig.shared";
import { userRouter } from "./modules/users/infra/http/routes";
import { notificationRouter } from "./modules/notification/infra/http/routes";
import { chatRouter } from "./modules/chat/infra/http/routes";

import { WebServer } from "./shared/infra/http/webServer";
import "./modules/notification/subscriptions";


new WebServer(config.api, [userRouter, notificationRouter, chatRouter]).start();
