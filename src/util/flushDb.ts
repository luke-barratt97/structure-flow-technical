import { Database } from "../database";
import { jsonSchema as companySchema } from "../collections/company";

/**
 * ## Flush Database
 *
 * Delete the companies collection and recreate it
 */
export async function flushDb(): Promise<void> {
  try {
    const db = await Database.getInstance();
    // Drop companies collection
    await db.collection("companies").drop();
    // Create companies collection
    await db.createCollection("companies", {
      validator: {
        $jsonSchema: companySchema,
      },
    });

    await Database.close();
    console.log("Database flushed successfully");
  } catch (error) {
    throw error;
  }
}

flushDb();
