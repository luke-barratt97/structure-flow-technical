import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config();

export class Redis {
  private static client: RedisClientType | null = null;
  private static connectionString: string | undefined = process.env.REDIS_URL;

  public static async getClient(): Promise<RedisClientType> {
    if (!Redis.client) {
      if (!Redis.connectionString)
        throw new Error("REDIS_URL is not set in the environment variables.");

      try {
        Redis.client = createClient({
          url: Redis.connectionString,
        });
      } catch (error) {
        console.error("Error connecting to redis:", error);
        throw error;
      }

      await Redis.client.connect();
    }

    return Redis.client;
  }

  public static async close(): Promise<void> {
    if (Redis.client) {
      await Redis.client.quit();
      Redis.client = null;
    }
  }
}
