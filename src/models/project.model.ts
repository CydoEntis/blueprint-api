import mongoose, { Document, Schema } from "mongoose";

export interface IProject {
	title: string;
	team: string;
	type: string;
	description: string;
	dueDate: Date;
	tasks: string[];
	users: string[];
	createdBy: string;
}

export interface IProjectModel extends IProject, Document {}

const ProjectSchema: Schema = new Schema(
	{
		title: { type: String, required: [true, "Please add a title"] },
		team: { type: String, required: [true, "Please assign a team"] },
		type: { type: String, required: [true, "Please select a type"] },
		description: { type: String, required: [true, "Please add a description"] },
		dueDate: { type: Date, required: [true, "Please add a due date"] },
		tasks: { type: [Schema.Types.ObjectId], ref: "Task" },
		users: { type: [Schema.Types.ObjectId], ref: "User", required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<IProjectModel>("Project", ProjectSchema);
