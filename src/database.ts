import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, Db } from "mongodb";

// Load environment variables
dotenv.config();

// Cached database connection
let cachedDb: Db | null = null;

// Create MongoClient
export const mongoDbClient: MongoClient = new MongoClient(
  process.env.MONGODB_URI!,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  }
);

/**
 * ## Database Connection
 *
 * Connect to the MongoDB client to the database
 *
 * @returns {Promise<Db>} - The database connection
 */
export async function dbConnection(): Promise<Db> {
  // Is db connection already established
  if (cachedDb) {
    return cachedDb;
  }
  try {
    // Connect the client to the database
    await mongoDbClient.connect();
    // Initialise database
    const db: Db = mongoDbClient.db(process.env.MONGO_DB_NAME!);
    // Cache db connection
    cachedDb = db;
    // Ping to check connection
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
