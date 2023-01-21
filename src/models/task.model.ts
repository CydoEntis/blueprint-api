import mongoose, { Document, Schema } from "mongoose";

export interface ITask {
	projectId: string;
	title: string;
	type: string;
	description: string;
	subTasks: string[];
	dueDate: Date;
	comments: string[];
	users: string[];
}

export interface ITaskModel extends ITask, Document {}

const TaskSchema: Schema = new Schema(
	{
		projectId: { type: String, required: true },
		title: { type: String, required: true },
		type: { type: String, required: true },
		description: { type: String, required: true },
		subTasks: { type: [Schema.Types.ObjectId], ref: "SubTask" },
		dueDate: { type: Date, required: true },
		comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
		users: { type: [Schema.Types.ObjectId], ref: "User", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<ITaskModel>("Task", TaskSchema);
