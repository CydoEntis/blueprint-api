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
	createdBy: string;
}

export interface ITaskModel extends ITask, Document {}

const TaskSchema: Schema = new Schema(
	{
		projectId: { type: String, required: true },
		title: { type: String, required: [true, "Please add a title"] },
		type: { type: String, required: [true, "Please select a type"] },
		description: { type: String, required: [true, "Please add a description"] },
		subTasks: { type: [Schema.Types.ObjectId], ref: "SubTask" },
		dueDate: { type: Date, required: [true, "Please add a due date"] },
		comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
		users: {
			type: [Schema.Types.ObjectId],
			ref: "User",
			required: [true, "Please add at least one user"],
		},
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<ITaskModel>("Task", TaskSchema);
