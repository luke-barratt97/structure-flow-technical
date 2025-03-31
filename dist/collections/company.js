"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonSchema = void 0;
// MongoDB Schema Validation for Companies Collection
exports.jsonSchema = {
    bsonType: "object",
    title: "Company Object Schema Validation",
    required: [
        "_id",
        "name",
        "dateIncorporated",
        "description",
        "totalEmployees",
        "address",
    ],
    additionalProperties: false,
    properties: {
        _id: {
            bsonType: "objectId",
        },
        name: {
            bsonType: "string",
        },
        dateIncorporated: {
            bsonType: "string",
        },
        description: {
            bsonType: "string",
        },
        totalEmployees: {
            bsonType: "int",
        },
        address: {
            bsonType: "object",
            title: "company address",
            required: ["street", "city", "postcode"],
            additionalProperties: false,
            properties: {
                street: {
                    bsonType: "string",
                },
                city: {
                    bsonType: "string",
                },
                postcode: {
                    bsonType: "string",
                },
            },
        },
    },
};
