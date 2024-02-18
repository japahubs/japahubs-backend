import { RedisStore } from "./redisConnection";

describe("redis", () => {
  test("connecting to the redis server", async () => {
    const redis = new RedisStore();
    const result = await redis.testConnection();
    expect(result).toBeTruthy();
  });
});
