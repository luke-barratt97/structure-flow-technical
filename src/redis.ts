import { createClient, RedisClientType } from "redis";

// Cache connection
let redisClient: RedisClientType | null = null;

/**
 * ## Get Redis Client
 *
 * Connect to Redis client
 *
 * @returns {Promise<RedisClientType>} - The Redis client
 */
export async function getRedisClient(): Promise<RedisClientType> {
  // If Redis client already cached, return it
  if (redisClient) {
    return redisClient;
  }

  // Create Redis client
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL!,
    });
  } catch (err) {
    throw err;
  }

  // Connect to Redis
  await redisClient.connect();
  console.log("Successfully connected to Redis");

  return redisClient;
}
