import mongoose, { Document, Schema } from "mongoose";

import { NextFunction } from "express";
import bcrypt from "bcrypt";
import { config } from "../config/config";
import jwt from "jsonwebtoken";
import { nextTick } from "process";

export interface IUser {
	username: string;
	password: string;
	email: string;
	firstName: string;
	lastName: string;
	avatar: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema<IUserModel>(
	{
		username: { type: String, required: [true, "Please provide a username"] },
		password: { type: String, required: [true, "Please provide a password"] },
		email: { type: String, required: [true, "Please provide a valid email"] },
		firstName: {
			type: String,
			required: [true, "Please provide a first name"],
		},
		lastName: { type: String, required: [true, "Please provide a last name"] },
		avatar: { type: String },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

UserSchema.pre("save", async function (next) {
	let user = this as IUserModel;

	if (!user.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(config.saltRounds);
	const hash = await bcrypt.hashSync(user.password, salt);
	user.password = hash;
	return next();
});

UserSchema.methods.comparePassword = async function (
	checkPassword: string,
): Promise<boolean> {
	const user = this as IUserModel;

	try {
		const isValid = bcrypt.compare(checkPassword, user.password);
		if (!isValid) {
			return false;
		}
		return true;
	} catch (error: any) {
		return false;
	}
};

export default mongoose.model<IUserModel>("User", UserSchema);
