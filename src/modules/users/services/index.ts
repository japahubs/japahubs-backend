import { redisConnection } from "./redis/redisConnection";
import { RedisAuthService } from "./redis/redisAuthService";

const authService = new RedisAuthService(redisConnection);

export { authService };
