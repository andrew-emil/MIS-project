import "reflect-metadata";
import "express-async-error";

import { config } from "dotenv";
import express, { Application } from "express";
import { AppDataSource } from "./config/dataSource";
import router from "./routes";

config({ path: "./.env" });
const app: Application = express();
const port: number = parseInt(process.env.PORT as string) || 4000;

app.use(express.json());

app.use("/api", router)

const startServer = async () => {
	await AppDataSource.initialize();
	app.listen(port, () => {
		console.log(`app listening on port: ${port}`);
	});
};

startServer();
