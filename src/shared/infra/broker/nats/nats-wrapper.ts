import { Authenticator, connect, NatsConnection } from "nats";

export class NatsWrapper {
  private _client?: NatsConnection;
  private _moduleName?: string;

  constructor(moduleName: string) {
    this._moduleName = moduleName;
  }

  async connect(
    customAuth: Authenticator,
    serverUrls: string | string[] | undefined
  ): Promise<void> {
    try {
      this._client = await connect({
        authenticator: customAuth,
        servers: serverUrls,
      });
      console.log(
        `${
          this._moduleName ? this._moduleName : ""
        } connected to ${this._client.getServer()}`
      );
    } catch (error) {
      console.error(`error connecting to NATS server: `, error);
      throw error; // Re-throw to signal connection failure
    }
  }

  get client(): NatsConnection {
    if (!this._client) {
      throw new Error("NATS client not connected");
    }
    return this._client;
  }
}

// //export const natsWrapper = new NatsWrapper();
