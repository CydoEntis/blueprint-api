import mongoose, { Document, Schema } from "mongoose";

export interface IComment {
	taskId: string[];
	userId: string[];
	commentBody: string;
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
	{
		taskId: { type: Schema.Types.ObjectId, ref: "Task" },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		commentBody: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<ICommentModel>("Comment", CommentSchema);
