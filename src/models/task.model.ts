import mongoose, { Document, Schema } from "mongoose";

import User from "./user.model";

export interface ITask {
	title: string;
	team: string;
	type: string;
	description: string;
	dueDate: Date;
	progress: number;
}

export interface ITaskModel extends ITask, Document {}

const TaskSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		type: { type: String, required: true },
		description: { type: String, required: true },
		subTasks: { type: [Schema.Types.ObjectId], ref: "SubTask" },
		dueDate: { type: Date, required: true },
		comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
		user: { type: [Schema.Types.ObjectId], ref: "User", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<ITaskModel>("Task", TaskSchema);
