import mongoose, { Document, Schema } from "mongoose";

export interface IProject {}

export interface IProjectModel extends IProject, Document {}

const ProjectSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		team: { type: String, required: true },
		description: { type: String, required: true },
		dueDate: { type: Date, required: true },
		progress: { type: Number, default: 0 },
		// users: {[UserSchema]}
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<IProjectModel>("Project", ProjectSchema);
