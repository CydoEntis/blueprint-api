import express, { NextFunction, Request, Response } from "express";

import Logger from "./library/Logger";
import { config } from "./config/config";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import jobRoutes from "./routes/job.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Connect To MongoDB.
async function connectToDB() {
	try {
		await mongoose.connect(config.mongo.url, {
			retryWrites: true,
			w: "majority",
		});
		Logger.success("Connected to MongoDb");
		startServer();
	} catch (error: any) {
		Logger.error(error);
	}
}

connectToDB();

function startServer() {
	app.use((req: Request, res: Response, next: NextFunction) => {
		Logger.info(
			`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
		);

		res.on("finish", () => {
			Logger.info(
				`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`,
			);
		});

		next();
	});

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());

	// TODO: Add Routes...
	app.use("/user", userRoutes);
	app.use("/jobs", jobRoutes);

	app.use((req: Request, res: Response, next: NextFunction) => {
		const error = new Error("Not Found");
		Logger.error(error);

		return res.status(404).json({ message: error.message });
	});

	http
		.createServer(app)
		.listen(config.server.port, () =>
			Logger.success(`Server is running on port: ${config.server.port}`),
		);
}
