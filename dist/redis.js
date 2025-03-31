"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
const redis_1 = require("redis");
// Cache connection
let redisClient = null;
/**
 * ## Get Redis Client
 *
 * Connect to Redis client
 *
 * @returns {Promise<RedisClientType>} - The Redis client
 */
function getRedisClient() {
    return __awaiter(this, void 0, void 0, function* () {
        // If Redis client already cached, return it
        if (redisClient) {
            return redisClient;
        }
        // Create Redis client
        try {
            redisClient = (0, redis_1.createClient)({
                url: process.env.REDIS_URL,
            });
        }
        catch (err) {
            throw err;
        }
        // Connect to Redis
        yield redisClient.connect();
        console.log("Successfully connected to Redis");
        return redisClient;
    });
}
