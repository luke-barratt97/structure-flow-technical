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
exports.createCompany = createCompany;
exports.updateCompany = updateCompany;
exports.getCompany = getCompany;
exports.deleteCompany = deleteCompany;
const mongodb_1 = require("mongodb");
const database_1 = require("../database");
const helper_1 = require("./helper");
const redis_1 = require("../redis");
/**
 * ## Create Company
 *
 * Create a company document
 *
 * @param {Company} company - Company object
 * @returns {Promise<ObjectId>} - The ObjectId of the created company
 */
function createCompany(company) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.dbConnection)();
        try {
            const res = yield db
                .collection("companies")
                .insertOne(company);
            return res.insertedId;
        }
        catch (err) {
            throw err;
        }
    });
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
function updateCompany(id, company) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.dbConnection)();
        const companyUpdateObject = (0, helper_1.flattenAddressObject)(company);
        try {
            // Update company document
            yield db
                .collection("companies")
                .updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: companyUpdateObject });
            // Get updated company document
            let res = yield db
                .collection("companies")
                .findOne({ _id: new mongodb_1.ObjectId(id) });
            // Update company was updated and is cached update the cache
            if (res) {
                const redis = yield (0, redis_1.getRedisClient)();
                yield redis.set(`companies:${id}`, JSON.stringify(res), {
                    EX: 600, // Cache for 10 minutes
                    XX: true, // Only update if the cache key exists
                });
            }
            return res;
        }
        catch (err) {
            throw err;
        }
    });
}
/**
 * ## Get Company
 *
 * Get a company document
 *
 * @param {string} id - The ObjectId of the company to get
 * @returns {Promise<Company>} - Company object
 */
function getCompany(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Try to get company from cache first
            const redis = yield (0, redis_1.getRedisClient)();
            const cacheKey = `companies:${id}`;
            const cachedCompany = yield redis.get(cacheKey);
            // If company is cached return it
            if (cachedCompany) {
                return JSON.parse(cachedCompany);
            }
            // Not cached, get company from database
            const db = yield (0, database_1.dbConnection)();
            const company = yield db
                .collection("companies")
                .findOne({ _id: new mongodb_1.ObjectId(id) });
            // If company exists, cache it for 10 minutes
            if (company) {
                yield redis.set(cacheKey, JSON.stringify(company), {
                    EX: 600,
                });
            }
            return company;
        }
        catch (err) {
            throw err;
        }
    });
}
/**
 * ## Delete Company
 *
 * Delete a company document
 *
 * @param {string} id - The ObjectId of the company to delete
 * @returns {Promise<number>} - The number of documents deleted
 */
function deleteCompany(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.dbConnection)();
        try {
            // Delete from database first
            const res = yield db
                .collection("companies")
                .deleteOne({ _id: new mongodb_1.ObjectId(id) });
            // If company was deleted from database, delete from cache if it exists
            if (res.deletedCount === 1) {
                const redis = yield (0, redis_1.getRedisClient)();
                yield redis.del(`companies:${id}`);
            }
            return res.deletedCount;
        }
        catch (err) {
            throw err;
        }
    });
}
