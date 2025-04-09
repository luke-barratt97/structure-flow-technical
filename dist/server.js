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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const handlers_1 = require("./handlers/handlers");
const redis_1 = require("./redis");
const database_1 = require("./database");
const auth_1 = require("./auth");
// Load environment variables from .env file
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
// Create Company
app.post("/structure-flow/companies", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const companyId = yield (0, handlers_1.createCompany)(req.body);
        res.status(200).json({ message: "Company created", _id: companyId });
    }
    catch (err) {
        res.status(400).json({ message: "Bad Request", status: 400 });
    }
}));
// Get Company
app.get("/structure-flow/companies/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield (0, handlers_1.getCompany)(req.params.id);
        const message = company ? "Company found" : "Company not found";
        res.status(200).json({ message, company });
    }
    catch (err) {
        res.status(400).json({ message: "Bad Request", status: 400 });
    }
}));
// Update Company
app.patch("/structure-flow/companies/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield (0, handlers_1.updateCompany)(req.params.id, req.body);
        // If company does not exist, return 200 with message
        if (!company) {
            res.status(200).json({ message: "Company not found" });
            return;
        }
        // If company exists, return 200 with message and updated company document
        res.status(200).json({ message: "Company updated", company });
    }
    catch (err) {
        res.status(400).json({ message: "Bad Request", status: 400 });
    }
}));
// Delete Company
app.delete("/structure-flow/companies/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedCount = yield (0, handlers_1.deleteCompany)(req.params.id);
        const message = deletedCount === 1 ? "Company deleted" : "Company not found";
        res.status(200).json({ message, deletedCount });
    }
    catch (err) {
        res.status(400).json({ message: "Bad Request", status: 400 });
    }
}));
// Auth
app.post("/structure-flow/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const token = (0, auth_1.generateAccessToken)({ name: username });
    res.status(200).json({ message: "Token generated", token });
}));
// Start server
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Server running on port ${port} 🚀`);
        // Initialise Redis
        yield redis_1.Redis.getClient();
        // Initialise MongoDB
        yield database_1.Database.getInstance();
    }
    catch (err) {
        console.error("Error connecting to Redis or MongoDB:", err);
        process.exit(1);
    }
}));
