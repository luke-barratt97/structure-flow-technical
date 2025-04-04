import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, Db } from "mongodb";

dotenv.config();

export class Database {
  private static instance: Db | null = null;
  private static client: MongoClient | null = null;
  private static dbName: string | undefined = process.env.MONGO_DB_NAME;
  private static connectionString: string | undefined =
    process.env.MONGO_DB_URI;

  public static async getClient(): Promise<MongoClient> {
    if (!Database.client) {
      if (!Database.connectionString)
        throw new Error(
          "MONGO_DB_URI is not set in the environment variables."
        );
      try {
        Database.client = new MongoClient(Database.connectionString, {
          serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
          },
        });
        await Database.client.connect();
      } catch (error) {
        console.error("Error connecting client:", error);
        throw error;
      }
    }
    return Database.client;
  }

  public static async getInstance(): Promise<Db> {
    if (!Database.instance) {
      if (!Database.dbName)
        throw new Error(
          "MONGO_DB_NAME is not set in the environment variables."
        );
      try {
        Database.client = await Database.getClient();
        const db: Db = Database.client.db(Database.dbName);
        Database.instance = db;
      } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
      }
    }
    return Database.instance;
  }

  public static async close(): Promise<void> {
    if (Database.client) {
      await Database.client.close();
      Database.client = null;
      Database.instance = null;
    }
  }
}
