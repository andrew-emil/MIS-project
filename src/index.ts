import "reflect-metadata";
import "express-async-error";

import { config } from "dotenv";
import express, { Application } from "express";
import cors from "cors";  // Import cors
import { AppDataSource } from "./config/dataSource";
import router from "./routes";

config({ path: "./.env" });
const app: Application = express();
const port: number = parseInt(process.env.PORT as string) || 4000;

// Apply CORS middleware before any routes
app.use(cors({
  origin: "http://localhost:5173",  // Allow React app URL (modify if needed)
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allowed headers
  credentials: true,  // Allow credentials (cookies, etc.)
}));

app.use(express.json());
app.use("/api", router);

const startServer = async () => {
  await AppDataSource.initialize();
  app.listen(port, () => {
    console.log(`app listening on port: ${port}`);
  });
};

startServer();
