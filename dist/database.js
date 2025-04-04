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
exports.Database = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
class Database {
    static getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Database.client) {
                if (!Database.connectionString)
                    throw new Error("MONGO_DB_URI is not set in the environment variables.");
                try {
                    Database.client = new mongodb_1.MongoClient(Database.connectionString, {
                        serverApi: {
                            version: mongodb_1.ServerApiVersion.v1,
                            strict: true,
                            deprecationErrors: true,
                        },
                    });
                    yield Database.client.connect();
                }
                catch (error) {
                    console.error("Error connecting client:", error);
                    throw error;
                }
            }
            return Database.client;
        });
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Database.instance) {
                if (!Database.dbName)
                    throw new Error("MONGO_DB_NAME is not set in the environment variables.");
                try {
                    Database.client = yield Database.getClient();
                    const db = Database.client.db(Database.dbName);
                    Database.instance = db;
                }
                catch (error) {
                    console.error("Error connecting to database:", error);
                    throw error;
                }
            }
            return Database.instance;
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Database.client) {
                yield Database.client.close();
                Database.client = null;
                Database.instance = null;
            }
        });
    }
}
exports.Database = Database;
Database.instance = null;
Database.client = null;
Database.dbName = process.env.MONGO_DB_NAME;
Database.connectionString = process.env.MONGO_DB_URI;
