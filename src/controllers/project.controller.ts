import { NextFunction, Request, Response } from "express";

import Logger from "../library/Logger";
import Project from "../models/project.model";
import User from "../models/user.model";
import mongoose from "mongoose";

async function createProject(req: Request, res: Response) {
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

async function getProject(req: Request, res: Response) {
	const projectId = req.params.projectId;

	try {
		const project = await Project.findById(projectId)
			.populate("user")
			.select("-__v");

		if (!project) {
			return res.status(404).json({ message: "Project could not be found." });
		}

		return res.status(200).json({ project });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "Project count not be found" });
	}
}
export default {
	createProject,
};
