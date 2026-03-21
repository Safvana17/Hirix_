import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../../utils/logging/loger";

export const redisClient = new Redis(env.REDIS_URL);

redisClient.on("connect", () => {
  logger.info('Redis connected')
});

redisClient.on("error", (err) => {
  logger.error({error: err}, 'Redis connection error')
});
