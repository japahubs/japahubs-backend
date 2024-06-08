import redis from "redis";
import { authConfig, isDevelopment } from "../../../../config";

const port = authConfig.redisServerPort;
const host = authConfig.redisServerHost;
const redisConnection = isDevelopment
  ? redis.createClient(+port, host)
  : redis.createClient(authConfig.redisConnectionString!);

redisConnection.on("connect", () => {
  console.log(`[Redis]: Connected to redis server at ${host}:${port}`);
});

export { redisConnection };
