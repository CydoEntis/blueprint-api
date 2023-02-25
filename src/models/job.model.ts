import mongoose, { Document, Schema } from "mongoose";

export interface IJob {
  position: string;
  company: string;
  location: string;
  jobStatus: "pending" | "declined" | "interview";
  jobType: "remote" | "part-time" | "full-time" | "internship";
  interviewDate?: Date | null;
}

export interface IJobModel extends IJob, Document {}

const JobSchema: Schema = new Schema(
  {
    position: { type: String, required: [true, "Please enter a position"], trim: true },
    company: { type: String, required: [true, "Please enter a company"], trim: true },
    location: { type: String, required: [true, "Please enter a location"], trim: true },
    jobType: { type: String, required: [true, "Please select a valid type"], trim: true },
    jobStatus: { type: String, default: "pending" },
    description: { type: String, required: [true, "Please add a description"], trim: true },
    interviewDate: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model<IJobModel>("Job", JobSchema);
