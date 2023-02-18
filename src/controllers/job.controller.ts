import { NextFunction, Request, Response } from "express";

import Logger from "../library/Logger";
import Job from "../models/job.model";
import User from "../models/user.model";
import mongoose from "mongoose";

async function addJob(req: Request, res: Response) {
	const {
		position,
		company,
		location,
		jobType,
		description
	} = req.body;

	if (!position || !company || !location || !jobType || !description ) {
		Logger.error("Please provide all values.");
		return res.status(404).json("Please provide all values.");
	}

	try {
		const task = await Job.create({
			position,
			company,
			location,
			jobType,
			description
		});

		return res.status(201).json({ task });
	} catch (error: any) {
		Logger.error(error);
		return res.status(500).json({ message: error });
	}
}

// async function getJob(req: Request, res: Response) {
// 	const taskId = req.params.taskId;

// 	try {
// 		const task = await Task.findById(taskId).populate("users").select("-__v");

// 		if (!task) {
// 			return res.status(404).json({ message: "Task could not be found." });
// 		}

// 		return res.status(200).json({ task });
// 	} catch (error: any) {
// 		Logger.error(error.message);
// 		return res.status(404).json({ message: "Task count not be found" });
// 	}
// }

async function getJobs(req: Request, res: Response) {
	try {
		const jobs = await Job.find({});

		if (!jobs) {
			return res.status(404).json({ message: "No tasks could be found." });
		}

		res.status(200).json({ jobs });
	} catch (error: any) {
		return res.status(404).json({ message: "No tasks could be found." });
	}
}

// async function updateTask(req: Request, res: Response) {
// 	const taskId = req.params.taskId;
// 	req.body;

// 	try {
// 		const task = await Task.findById(taskId);

// 		if (!task) {
// 			return res.status(404).json({ message: "Task could not be found" });
// 		}

// 		// Create an updated task object and check to see if all were passed through.

// 		const updatedTask = await Task.findOneAndUpdate({ taskId }, {});

// 		return res.status(200).json({ updatedTask });
// 	} catch (error: any) {
// 		Logger.error(error);
// 		return res.status(404).json({ message: "Task could not be updated" });
// 	}
// }

// async function deleteTask(req: Request, res: Response) {
// 	const taskId = req.params.taskId;

// 	try {
// 		await Task.findByIdAndDelete(taskId);

// 		return res
// 			.status(201)
// 			.json({ message: `Task with id: ${taskId} was deleted.` });
// 	} catch (error: any) {
// 		Logger.error(error);
// 		return res
// 			.status(404)
// 			.json({ message: `Task with id: ${taskId} could not be deleted.` });
// 	}
// }

// async function deleteAllTasks(req: Request, res: Response) {
// 	const { projectId } = req.body;

// 	try {
// 		await Task.deleteMany({ projectId });

// 		return res
// 			.status(201)
// 			.json({ message: `Tasks with projectId: ${projectId} were deleted.` });
// 	} catch (error: any) {
// 		return res
// 			.status(404)
// 			.json({ message: `No tasks with projectId: ${projectId} were deleted.` });
// 	}
// }

export default {
	addJob,
	getJobs
};
