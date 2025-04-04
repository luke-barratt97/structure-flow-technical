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
exports.flushDb = flushDb;
const database_1 = require("../database");
const company_1 = require("../collections/company");
/**
 * ## Flush Database
 *
 * Delete the companies collection and recreate it
 */
function flushDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield database_1.Database.getInstance();
            // Drop companies collection
            yield db.collection("companies").drop();
            // Create companies collection
            yield db.createCollection("companies", {
                validator: {
                    $jsonSchema: company_1.jsonSchema,
                },
            });
            yield database_1.Database.close();
            console.log("Database flushed successfully");
        }
        catch (error) {
            throw error;
        }
    });
}
flushDb();
