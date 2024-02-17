import cors from "cors";
import express, { Router } from "express";
import { Server } from "http";

import { ProcessService } from "../../processes/processService";

type WebServerConfig = {
  port: number;
};

export class WebServer {
  private express: express.Express;
  private server: Server | undefined;
  private started = false;

  constructor(private config: WebServerConfig, private routers: Router[]) {
    this.express = this.createExpress();
    this.configureExpress();
    this.setupRoutes();
  }

  private createExpress() {
    return express();
  }

  private configureExpress() {
    this.express.use(cors());
    this.express.use(express.json());
  }

  private setupRoutes() {
    this.routers.forEach((router) => {
      this.express.use(router);
    });
  }

  getHttp() {
    if (!this.server) throw new Error("Server not yet started");
    return this.server;
  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        this.server = this.express.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.started = true;
          resolve();
        });
      });
    });
  }

  isStarted() {
    return this.started;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, _reject) => {
      if (this.server) {
        this.server.close(() => {
          this.started = false;
          resolve();
        });
      }
    });
  }
}
