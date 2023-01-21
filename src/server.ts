import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "./config/config";

const app = express();

// Connect To MongoDB.
async function connectToDB() {
	try {
		await mongoose.connect(config.mongo.url, {
			retryWrites: true,
			w: "majority",
		});
		startServer();
	} catch (error: any) {}
}

connectToDB();

function startServer() {
	app.use((req: Request, res: Response, next: NextFunction) => {
		next();
	});

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());
}
