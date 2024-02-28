import { redisConnection } from "../redisConnection";
import { RedisStore } from "./redisStore";

describe("redis", () => {
  test("connecting to the redis server", async () => {
    const redis = new RedisStore(redisConnection);
    const result = await redis.testConnection();
    expect(result).toBeTruthy();
  });

  afterAll(async () => {
    await redisConnection.quit();
  });
});
