import mongoose, { Document, Schema } from "mongoose";

export interface ISubTask {
	text: string;
}

export interface ISubTaskModel extends ISubTask, Document {}

const SubTaskSchema: Schema = new Schema(
	{
		text: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<ISubTaskModel>("Task", SubTaskSchema);
