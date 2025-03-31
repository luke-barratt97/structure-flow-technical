import { mongoDbClient } from "../database";
import { jsonSchema as companySchema } from "../collections/company";
import { Db } from "mongodb";

/**
 * ## Flush Database
 *
 * Delete the companies collection and recreate it
 */
export async function flushDb(): Promise<void> {
  try {
    mongoDbClient.connect();
    const db: Db = mongoDbClient.db(process.env.MONGO_DB_NAME!);

    // Drop companies collection
    await db.collection("companies").drop();

    // Create companies collection
    await db.createCollection("companies", {
      validator: {
        $jsonSchema: companySchema,
      },
    });

    console.log("Database flushed successfully");
    mongoDbClient.close();
  } catch (error) {
    throw error;
  }
}

flushDb();
