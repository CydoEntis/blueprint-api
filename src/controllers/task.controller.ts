import { NextFunction, Request, Response } from "express";

import Logger from "../library/Logger";
import Task from "../models/task.model";
import User from "../models/user.model";
import mongoose from "mongoose";

async function createTask(req: Request, res: Response) {
	const { title, type, description, subTasks, dueDate, users, createdBy } =
		req.body;
	const projectId = req.params.projectId;

	if (!title || !type || !description || !dueDate || !users || !createdBy) {
		Logger.error("Please provide all values.");
		throw Error("Please provide all values.");
	}

	try {
		const task = await Task.create({
			projectId,
			title,
			type,
			description,
			subTasks,
			dueDate,
			users,
			createdBy,
		});

		return res.status(201).json({ task });
	} catch (error: any) {
		Logger.error(error);
		return res.status(500).json({ message: error });
	}
}

async function getTask(req: Request, res: Response) {
	const taskId = req.params.taskId;

	try {
		const task = await Task.findById(taskId).populate("users").select("-__v");

		if (!task) {
			return res.status(404).json({ message: "Task could not be found." });
		}

		return res.status(200).json({ task });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "Task count not be found" });
	}
}

async function updateTask(req: Request, res: Response) {
	const taskId = req.params.taskId;

	try {
		const task = await Task.findById(taskId);

		if (!task) {
			return res.status(404).json({ message: "Task could not be found" });
		}

		// Create an updated task object and check to see if all were passed through.

		const updatedTask = await Task.findOneAndUpdate({ taskId }, req.body);

		return res.status(200).json({ updatedTask });
	} catch (error: any) {
		Logger.error(error);
		return res.status(404).json({ message: "Task could not be updated" });
	}
}

async function deleteTask(req: Request, res: Response) {
	const taskId = req.params.taskId;

	try {
		await Task.findByIdAndDelete(taskId);

		return res
			.status(201)
			.json({ message: `Task with id: ${taskId} was deleted.` });
	} catch (error: any) {
		Logger.error(error);
		return res
			.status(404)
			.json({ message: `Task with id: ${taskId} could not be deleted.` });
	}
}

export default {
	createTask,
	getTask,
	updateTask,
	deleteTask,
};
