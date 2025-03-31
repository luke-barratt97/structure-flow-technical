"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenAddressObject = flattenAddressObject;
/**
 * ## Flatten Address Object
 *
 * Flatten the address object to dot notation if it exists
 *
 * @param company - Company object
 * @returns Company object with address flattened
 */
function flattenAddressObject(company) {
    if (!company.address) {
        return company;
    }
    const updatedCompany = Object.assign({}, company);
    delete updatedCompany.address;
    // Convert address fields to dot notation
    if (company.address.street) {
        updatedCompany["address.street"] = company.address.street;
    }
    if (company.address.city) {
        updatedCompany["address.city"] = company.address.city;
    }
    if (company.address.postcode) {
        updatedCompany["address.postcode"] = company.address.postcode;
    }
    return updatedCompany;
}
