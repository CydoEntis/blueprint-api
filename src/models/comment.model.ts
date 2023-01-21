import mongoose, { Document, Schema } from "mongoose";

export interface IComment {
	user: string;
	body: string;
}

export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: "User" },
		body: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<ICommentModel>("Comment", CommentSchema);
