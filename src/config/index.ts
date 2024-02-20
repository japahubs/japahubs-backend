const authConfig = {
  secret: process.env.APP_SECRET,
  tokenExpiryTime: 300, // 5 minutes
  redisServerPort: process.env.REDIS_PORT || 6379,
  redisServerHost: process.env.REDIS_HOST,
  redisConnectionString: process.env.REDIS_URL,
};

export { authConfig };
