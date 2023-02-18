import mongoose, { Document, Schema } from "mongoose";

export interface IJob {
	position: string;
	company: string;
	location: string;
	jobType: "remote" | "part-time" | "full-time" | "internship"
	interviewDate?: Date | null
}

export interface IJobModel extends IJob, Document {}

const JobSchema: Schema = new Schema(
	{
		position: { type: String, required: [true, "Please enter a position" ]},
		company: { type: String, required: [true, "Please enter a company"] },
		location: { type: String, required: [true, "Please enter a location"] },
		jobType: { type: String,  required: [true, "Please select a valid type"]},
		description: { type: String, required: [true, "Please add a description"] },
		interviewDate: { type: Date, default: null },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);


export default mongoose.model<IJobModel>("Job", JobSchema);
