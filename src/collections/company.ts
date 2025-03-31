/**
 * ## Company Interface
 *
 * Represents a company document in MongoDB
 */
export interface Company {
  name: string;
  dateIncorporated: string;
  description: string;
  totalEmployees: number;
  address: {
    street: string;
    city: string;
    postcode: string;
  };
}

// MongoDB Schema Validation for Companies Collection
export const jsonSchema = {
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
