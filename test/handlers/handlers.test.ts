import { Company } from "../../src/collections/company";
import { ObjectId } from "mongodb";

// Company ID for testing
const companyId = "6061f1f3b5c7962b18c13a40";

// Mock company data
const mockCompany: Company = {
  name: "Test Company",
  dateIncorporated: "2023-01-01T00:00:00.000Z",
  description: "Test description",
  totalEmployees: 10,
  address: {
    street: "123 Test Street",
    city: "Test City",
    postcode: "TE57 1NG",
  },
};

const mockUpdatedCompany: Company = {
  name: "Updated Company",
  dateIncorporated: "2023-02-02T12:30:45.000Z",
  description: "Updated description",
  totalEmployees: 20,
  address: {
    street: "456 Test Street",
    city: "Test City Updated",
    postcode: "TE57 2NG",
  },
};

// Setup mocks
const companyOId = new ObjectId(companyId);
const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: companyOId });
const mockFindOne = jest
  .fn()
  .mockResolvedValue({ _id: companyOId, ...mockCompany });
const mockUpdateOne = jest
  .fn()
  .mockResolvedValue({ acknowledged: true, matchedCount: 1, modifiedCount: 1 });
const mockDeleteOne = jest
  .fn()
  .mockResolvedValue({ acknowledged: true, deletedCount: 1 });
const mockRedisGet = jest.fn().mockResolvedValue(null);
const mockRedisSet = jest.fn().mockResolvedValue("OK");
const mockRedisDelete = jest.fn().mockResolvedValue(1);

// Mock modules
jest.mock("../../src/database", () => ({
  dbConnection: jest.fn().mockResolvedValue({
    collection: jest.fn().mockReturnValue({
      insertOne: mockInsertOne,
      findOne: mockFindOne,
      updateOne: mockUpdateOne,
      deleteOne: mockDeleteOne,
    }),
  }),
}));

jest.mock("../../src/redis", () => ({
  getRedisClient: jest.fn().mockResolvedValue({
    get: mockRedisGet,
    set: mockRedisSet,
    del: mockRedisDelete,
  }),
}));

// Import handler functions
import {
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
} from "../../src/handlers/handlers";

// Run Tests
describe("Company Handlers", () => {
  // Clear mocks before each test
  beforeEach(jest.clearAllMocks);

  describe("createCompany", () => {
    test("should create a company and return its ID", async () => {
      const result = await createCompany(mockCompany);
      expect(mockInsertOne).toHaveBeenCalledWith(mockCompany);
      expect(result).toBe(companyOId);
    });
  });

  // ----------- Get Company -----------

  describe("getCompany", () => {
    test("should get a company from database when not in cache", async () => {
      const result = await getCompany(companyId);

      expect(mockRedisGet).toHaveBeenCalledWith(`companies:${companyId}`);
      expect(mockFindOne).toHaveBeenCalledWith({ _id: companyOId });
      expect(mockRedisSet).toHaveBeenCalledWith(
        `companies:${companyId}`,
        JSON.stringify({ _id: companyOId, ...mockCompany }),
        { EX: 600 }
      );
      expect(result).toEqual({ _id: companyOId, ...mockCompany });
    });

    test("should return a company from cache when available", async () => {
      mockRedisGet.mockResolvedValueOnce(
        JSON.stringify({ _id: companyId, ...mockCompany })
      );

      const result = await getCompany(companyId);

      expect(mockRedisGet).toHaveBeenCalledWith(`companies:${companyId}`);
      expect(mockFindOne).not.toHaveBeenCalled();
      expect(result).toEqual({ _id: companyId, ...mockCompany });
    });
  });

  // ----------- Update Company -----------

  describe("updateCompany", () => {
    test("should update a company and return the updated company", async () => {
      mockFindOne.mockResolvedValueOnce({
        _id: companyOId,
        ...mockUpdatedCompany,
      });

      const result = await updateCompany(companyId, mockUpdatedCompany);

      // Flattened address for MongoDB dot notation
      const flattenedAddress = {
        "address.street": mockUpdatedCompany.address.street,
        "address.city": mockUpdatedCompany.address.city,
        "address.postcode": mockUpdatedCompany.address.postcode,
      };

      expect(mockUpdateOne).toHaveBeenCalledWith(
        { _id: companyOId },
        {
          $set: {
            ...mockUpdatedCompany,
            address: undefined,
            ...flattenedAddress,
          },
        }
      );

      expect(result).toEqual({ _id: companyOId, ...mockUpdatedCompany });
    });

    test("should update cache if company is already cached", async () => {
      // Mock the updated company returned after update
      mockFindOne.mockResolvedValueOnce({
        _id: companyOId,
        ...mockUpdatedCompany,
      });

      const result = await updateCompany(companyId, mockUpdatedCompany);

      // Verify database was updated
      expect(mockUpdateOne).toHaveBeenCalled();

      // Verify updated company was fetched
      expect(mockFindOne).toHaveBeenCalledWith({ _id: companyOId });

      // Verify cache was attempted to be updated
      expect(mockRedisSet).toHaveBeenCalledWith(
        `companies:${companyId}`,
        JSON.stringify({ _id: companyOId, ...mockUpdatedCompany }),
        {
          EX: 600,
          XX: true,
        }
      );

      expect(result).toEqual({ _id: companyOId, ...mockUpdatedCompany });
    });
  });

  // ----------- Delete Company -----------

  describe("deleteCompany", () => {
    test("should delete company from cache when deleted from database", async () => {
      // Mock that company exists in cache
      mockRedisGet.mockResolvedValueOnce(
        JSON.stringify({ _id: companyId, ...mockCompany })
      );

      const result = await deleteCompany(companyId);

      // Verify database was deleted
      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: companyOId });

      // Verify cache was cleared
      expect(mockRedisDelete).toHaveBeenCalledWith(`companies:${companyId}`);

      expect(result).toBe(1);
    });

    test("should not delete from cache if database deletion fails", async () => {
      // Mock database deletion returning 0 (failure)
      mockDeleteOne.mockResolvedValueOnce({
        acknowledged: true,
        deletedCount: 0,
      });

      const result = await deleteCompany(companyId);

      // Verify database deletion was attempted
      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: companyOId });

      // Verify cache was NOT cleared
      expect(mockRedisDelete).not.toHaveBeenCalled();

      expect(result).toBe(0);
    });
  });
});
