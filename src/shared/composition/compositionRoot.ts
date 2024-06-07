import { userRouter } from "../../modules/users/infra/http/routes";
import { config } from "../config/appConfig.shared";
import { WebServer } from "../infra/http/webServer";
import { Router } from "express";

export class CompositionRoot {
  private webServer: WebServer;
  private routers: Router[];

  constructor() {
    this.routers = [userRouter];
    this.webServer = this.createWebServer();
  }

  createWebServer() {
    return new WebServer(config.api, this.routers);
  }

  getWebServer() {
    return this.webServer;
  }
}
