import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Company } from "./collections/company";
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from "./handlers/handlers";
import { getRedisClient } from "./redis";
import { dbConnection } from "./database";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Create Company
app.post("/structure-flow/companies", async (req: Request, res: Response) => {
  try {
    const companyId: ObjectId = await createCompany(req.body);
    res.status(200).json({ message: "Company created", _id: companyId });
  } catch (err) {
    res.status(400).json({ message: "Bad Request", status: 400 });
  }
});

// Get Company
app.get(
  "/structure-flow/companies/:id",
  async (req: Request, res: Response) => {
    try {
      const company: Company | null = await getCompany(req.params.id);
      res.status(200).json(company);
    } catch (err) {
      res.status(400).json({ message: "Bad Request", status: 400 });
    }
  }
);

// Update Company
app.patch(
  "/structure-flow/companies/:id",
  async (req: Request, res: Response) => {
    try {
      const company: Company | null = await updateCompany(
        req.params.id,
        req.body
      );
      // If company does not exist, return 200 with message
      if (!company) {
        res.status(200).json({ message: "Company not found" });
        return;
      }
      // If company exists, return 200 with message and updated company document
      res.status(200).json({ message: "Company updated", company });
    } catch (err) {
      res.status(400).json({ message: "Bad Request", status: 400 });
    }
  }
);

// Delete Company
app.delete(
  "/structure-flow/companies/:id",
  async (req: Request, res: Response) => {
    try {
      const deletedCount: number = await deleteCompany(req.params.id);
      const message =
        deletedCount === 1 ? "Company deleted" : "Company not found";
      res.status(200).json({ message, deletedCount });
    } catch (err) {
      res.status(400).json({ message: "Bad Request", status: 400 });
    }
  }
);

// Start server
app.listen(port, async () => {
  try {
    console.log(`Server running on port ${port} 🚀`);
    // Connect to Redis
    await getRedisClient();
    // Connect to MongoDB
    await dbConnection();
  } catch (err) {
    console.error("Error connecting to Redis or MongoDB:", err);
    process.exit(1);
  }
});
