import mongoose, { Document, Schema } from "mongoose";

export interface IUser {}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
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

export default mongoose.model<IUserModel>("Project", UserSchema);
