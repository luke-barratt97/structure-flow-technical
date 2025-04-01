"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.authenticateToken = authenticateToken;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
function generateAccessToken(user) {
    return jsonwebtoken_1.default.sign(user, process.env.TOKEN_SECRET);
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // Authorization header is required
    if (token == null) {
        return res.sendStatus(401);
    }
    // Verify the token
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        // If the token is invalid, return a 403 Forbidden status
        if (err)
            return res.sendStatus(403);
        next();
    });
}
