import { createClient } from "redis";
import type { RedisClientType } from "redis";
import { logger } from "../../helper/utils/logger";

type RedisClient = RedisClientType;

class RedisHandler {
  private redisClient: RedisClient;

  constructor() {
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    const cacheOptions = { url };

    this.redisClient = createClient(cacheOptions);
    this.redisClient
      .on("error", (err) => logger.error(`Redis Error: ${err.message}`))
      .on("connect", () => logger.info("Redis connected"))
      .on("reconnecting", () => logger.info("Redis reconnecting"))
      .on("ready", () => logger.info("Redis ready!"))
      .connect();
  }

  public async set(key: string, value: string, duration: number): Promise<any> {
    await this.redisClient.set(key, value, {
      EX: duration,
      NX: true,
    });
  }

  public async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}

const redisHandler = new RedisHandler();

export { redisHandler };
