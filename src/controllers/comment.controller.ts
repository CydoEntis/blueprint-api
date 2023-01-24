import { NextFunction, Request, Response } from "express";

import Comment from "../models/comment.model";
import Logger from "../library/Logger";
import User from "../models/user.model";
import mongoose from "mongoose";

async function createComment(req: Request, res: Response) {
	const { taskId, userId, commentBody } = req.body;

	if (!commentBody) {
		Logger.error("Please provide all values.");
		throw Error("Please provide all values.");
	}

	try {
		const comment = await Comment.create({
			taskId,
			userId,
			commentBody,
		});

		return res.status(201).json({ comment });
	} catch (error: any) {
		Logger.error(error);
		return res.status(500).json({ message: error });
	}
}

async function getComment(req: Request, res: Response) {
	const commentId = req.params.commentId;

	try {
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment could not be found." });
		}

		return res.status(200).json({ comment });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "Comment count not be found" });
	}
}

async function getComments(req: Request, res: Response) {
	try {
		const comments = await Comment.find().populate("users");

		if (!comments) {
			return res.status(404).json({ message: "No comments could be found." });
		}

		res.status(200).json({ comments });
	} catch (error: any) {
		return res.status(404).json({ message: "No comments could be found." });
	}
}

async function updateComment(req: Request, res: Response) {
	const { taskId, userId, commentBody } = req.body;
	const commentId = req.params.commentId;

	try {
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment could not be found" });
		}

		// Create an updated comment object and check to see if all were passed through.

		const updatedComment = await Comment.findOneAndUpdate(
			{ commentId },
			{
				taskId,
				userId,
				commentBody,
			},
		);

		return res.status(200).json({ updatedComment });
	} catch (error: any) {
		Logger.error(error);
		return res.status(404).json({ message: "Comment could not be updated" });
	}
}

async function deleteComment(req: Request, res: Response) {
	const commentId = req.params.commentId;

	try {
		await Comment.findByIdAndDelete(commentId);

		return res
			.status(201)
			.json({ message: `Comment with id: ${commentId} was deleted.` });
	} catch (error: any) {
		Logger.error(error);
		return res
			.status(404)
			.json({ message: `Comment with id: ${commentId} could not be deleted.` });
	}
}

async function deleteAllComments(req: Request, res: Response) {
	const { projectId } = req.body;

	try {
		await Comment.deleteMany({ projectId });

		return res
			.status(201)
			.json({ message: `Comments with projectId: ${projectId} were deleted.` });
	} catch (error: any) {
		return res.status(404).json({
			message: `No comments with projectId: ${projectId} were deleted.`,
		});
	}
}

export default {
	createComment,
	getComment,
	getComments,
	updateComment,
	deleteComment,
	deleteAllComments,
};
