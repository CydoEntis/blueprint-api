import { NextFunction, Request, Response } from "express";

import Logger from "../library/Logger";
import Project from "../models/project.model";
import User from "../models/user.model";
import mongoose from "mongoose";

async function createProject(req: Request, res: Response, next: NextFunction) {
	const { title, team, type, description, dueDate, users, createdBy } =
		req.body;

	if (
		!title ||
		!team ||
		!type ||
		!description ||
		!dueDate ||
		!users ||
		!createdBy
	) {
		Logger.error("Please provide all values.");
		throw Error("Please provide all values.");
	}

	try {
		const project = await Project.create({
			title,
			team,
			type,
			description,
			dueDate,
			users,
			createdBy,
		});

		return res.status(201).json({ project });
	} catch (error: any) {
		Logger.error(error);
		return res.status(500).json({ message: error });
	}
}

export default {
	createProject,
};
