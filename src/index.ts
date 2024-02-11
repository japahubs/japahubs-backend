import { userRouter } from "./modules/users/infra/http/routes";
import { config } from "./shared/config/appConfig.shared";

import { WebServer } from "./shared/http/webServer";

new WebServer({ port: config.api.port }, [userRouter]).start();
