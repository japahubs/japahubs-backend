import redis from "redis";
import { Redis } from "redis";
import { authConfig } from "../src/config";

const port = authConfig.redisServerPort;
const host = authConfig.redisServerHost;
const redisConnection: Redis = redis.createClient(port, host);

redisConnection.on("connect", () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`);
});

export { redisConnection };
