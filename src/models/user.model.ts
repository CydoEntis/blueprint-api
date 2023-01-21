import mongoose, { Document, Schema } from "mongoose";

export interface IUser {}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		password: { type: String, required: true },
		email: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		avatar: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

export default mongoose.model<IUserModel>("Project", UserSchema);
