import { redisConnection } from "redis/redisConnection";

export class RedisStore {
  async testConnection(): Promise<boolean> {
    try {
      redisConnection.set("testKey", "testValue", (err, reply) => {
        if (err) {
          return false;
        } else {
          redisConnection.get("testKey", (err, value) => {
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
      redisConnection.quit();

      return false;
    }
  }
}
