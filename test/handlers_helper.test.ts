import { flattenAddressObject } from "../src/handlers/helper";
import { Company } from "../src/collections/company";

describe("Handlers Helper", () => {
  describe("flattenAddressObject", () => {
    test("should convert address fields to dot notation", () => {
      const company: Company = {
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

      const result = flattenAddressObject(company);

      expect(result.name).toBe("Test Company");
      expect(result.address).toBeUndefined();
      expect(result["address.street"]).toBe("123 Test Street");
      expect(result["address.city"]).toBe("Test City");
      expect(result["address.postcode"]).toBe("TE57 1NG");
    });

    test("should handle missing address", () => {
      const company = {
        name: "Test Company",
        dateIncorporated: "2023-01-01T00:00:00.000Z",
        description: "Test description",
        totalEmployees: 10,
      } as Company;

      const result = flattenAddressObject(company);

      // Should return original company object
      expect(result).toEqual(company);
    });
  });
});
