import mongoose, { Document, Schema } from "mongoose";

export interface IProject {
	title: string;
	team: string;
	type: string;
	description: string;
	dueDate: Date;
	progress: number;
	users: string[];
}

export interface IProjectModel extends IProject, Document {}

const ProjectSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		team: { type: String, required: true },
		type: { type: String, required: true },
		description: { type: String, required: true },
		dueDate: { type: Date, required: true },
		progress: { type: Number, default: 0 },
		users: { type: [Schema.Types.ObjectId], ref: "User", required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<IProjectModel>("Project", ProjectSchema);
