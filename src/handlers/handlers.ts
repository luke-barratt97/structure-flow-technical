import { Db, ObjectId, InsertOneResult, DeleteResult } from "mongodb";
import { Company } from "../collections/company";
import { dbConnection } from "../database";
import { flattenAddressObject } from "./helper";
import { getRedisClient } from "../redis";

/**
 * ## Create Company
 *
 * Create a company document
 *
 * @param {Company} company - Company object
 * @returns {Promise<ObjectId>} - The ObjectId of the created company
 */
export async function createCompany(company: Company): Promise<ObjectId> {
  const db = await dbConnection();
  try {
    const res: InsertOneResult = await db
      .collection("companies")
      .insertOne(company);
    return res.insertedId as ObjectId;
  } catch (err) {
    throw err;
  }
}

/**
 * ## Update Company
 *
 * Update a company document
 *
 * @param {string} id - The ObjectId of the company to update
 * @param {Company} company - Company object
 * @returns {Promise<Company>} - The updated company object
 */
export async function updateCompany(
  id: string,
  company: Company
): Promise<Company | null> {
  const db = await dbConnection();
  const companyUpdateObject = flattenAddressObject(company);
  try {
    // Update company document
    await db
      .collection("companies")
      .updateOne({ _id: new ObjectId(id) }, { $set: companyUpdateObject });

    // Get updated company document
    let res: Company | null = await db
      .collection<Company>("companies")
      .findOne({ _id: new ObjectId(id) });

    // Update company was updated and is cached update the cache
    if (res) {
      const redis = await getRedisClient();
      await redis.set(`companies:${id}`, JSON.stringify(res), {
        EX: 600, // Cache for 10 minutes
        XX: true, // Only update if the cache key exists
      });
    }

    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * ## Get Company
 *
 * Get a company document
 *
 * @param {string} id - The ObjectId of the company to get
 * @returns {Promise<Company>} - Company object
 */
export async function getCompany(id: string): Promise<Company | null> {
  try {
    // Try to get company from cache first
    const redis = await getRedisClient();
    const cacheKey = `companies:${id}`;
    const cachedCompany = await redis.get(cacheKey);

    // If company is cached return it
    if (cachedCompany) {
      return JSON.parse(cachedCompany);
    }

    // Not cached, get company from database
    const db: Db = await dbConnection();
    const company: Company | null = await db
      .collection<Company>("companies")
      .findOne({ _id: new ObjectId(id) });

    // If company exists, cache it for 10 minutes
    if (company) {
      await redis.set(cacheKey, JSON.stringify(company), {
        EX: 600,
      });
    }

    return company;
  } catch (err) {
    throw err;
  }
}

/**
 * ## Delete Company
 *
 * Delete a company document
 *
 * @param {string} id - The ObjectId of the company to delete
 * @returns {Promise<number>} - The number of documents deleted
 */
export async function deleteCompany(id: string): Promise<number> {
  const db = await dbConnection();
  try {
    // Delete from database first
    const res: DeleteResult = await db
      .collection("companies")
      .deleteOne({ _id: new ObjectId(id) });

    // If company was deleted from database, delete from cache if it exists
    if (res.deletedCount === 1) {
      const redis = await getRedisClient();
      await redis.del(`companies:${id}`);
    }

    return res.deletedCount;
  } catch (err) {
    throw err;
  }
}
