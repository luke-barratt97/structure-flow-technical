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
exports.mongoDbClient = void 0;
exports.dbConnection = dbConnection;
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
// Load environment variables
dotenv_1.default.config();
// Cached database connection
let cachedDb = null;
// Create MongoClient
exports.mongoDbClient = new mongodb_1.MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
/**
 * ## Database Connection
 *
 * Connect to the MongoDB client to the database
 *
 * @returns {Promise<Db>} - The database connection
 */
function dbConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        // Is db connection already established
        if (cachedDb) {
            return cachedDb;
        }
        try {
            // Connect the client to the database
            yield exports.mongoDbClient.connect();
            // Initialise database
            const db = exports.mongoDbClient.db(process.env.MONGO_DB_NAME);
            // Cache db connection
            cachedDb = db;
            // Ping to check connection
            yield db.command({ ping: 1 });
            console.log("Successfully connected to MongoDB");
            return db;
        }
        catch (error) {
            console.error("Error connecting to MongoDB:", error);
            throw error;
        }
    });
}
