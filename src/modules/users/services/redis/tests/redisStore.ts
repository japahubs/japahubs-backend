import { Redis } from "redis";

export class RedisStore {
  private redisConnection: Redis;

  constructor(redisConnection: Redis) {
    this.redisConnection = redisConnection;
  }
  async testConnection(): Promise<boolean> {
    try {
      this.redisConnection.set("testKey", "testValue", (err, reply) => {
        if (err) {
          return false;
        } else {
          this.redisConnection.get("testKey", (err, value) => {
            if (err) {
              return false;
            } else {
              return true;
            }
          });
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
