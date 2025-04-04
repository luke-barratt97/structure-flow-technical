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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redis = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
dotenv_1.default.config();
class Redis {
    static getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Redis.client) {
                if (!Redis.connectionString)
                    throw new Error("REDIS_URL is not set in the environment variables.");
                try {
                    Redis.client = (0, redis_1.createClient)({
                        url: Redis.connectionString,
                    });
                }
                catch (error) {
                    console.error("Error connecting to redis:", error);
                    throw error;
                }
                yield Redis.client.connect();
            }
            return Redis.client;
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Redis.client) {
                yield Redis.client.quit();
                Redis.client = null;
            }
        });
    }
}
exports.Redis = Redis;
Redis.client = null;
Redis.connectionString = process.env.REDIS_URL;
