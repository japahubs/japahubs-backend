const authConfig = {
  secret: process.env.APP_SECRET,
  tokenExpiryTime: 300, // 5 minutes
  redisServerPort: process.env.REDIS_PORT || 6379,
  redisServerHost: process.env.REDIS_HOST,
  redisConnectionString: process.env.REDIS_URL,
};

const config = {
  sendGridUsername: process.env.SENDGRID_USERNAME,
  sendGridPassword: process.env.SENDGRID_PASSWORD,
  nodeMailerHost: process.env.MAIL_HOST,
  nodeMailerPort: process.env.MAIL_PORT,
  nodeMailerUsername: process.env.MAIL_USERNAME,
  nodeMailerPassword: process.env.MAIL_PASSWORD,
  isProduction: process.env.NODE_ENV === "production",
};

const isDevelopment = process.env.NODE_ENV === "development";

export { isDevelopment, authConfig, config };
