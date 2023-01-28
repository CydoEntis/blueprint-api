import mongoose, { Document, Schema } from "mongoose";

import bcrypt from "bcryptjs";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

export interface IUser {
	username: string;
	password: string | undefined;
	email: string;
	// avatar: string;
}

export interface IUserModel extends IUser, Document {
	comparePassword: (password: string) => boolean;
	createJWT: () => string;
}

const UserSchema: Schema = new Schema<IUserModel>(
	{
		username: { type: String, required: [true, "Please provide a username"] },
		password: {
			type: String,
			select: false,
			required: [true, "Please provide a password"],
		},
		email: { type: String, required: [true, "Please provide a valid email"] },
		// avatar: { type: String },
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	const salt = await bcrypt.genSalt(config.saltRounds);
	this.password = await bcrypt.hash(this.password, salt);
	return next();
});

UserSchema.methods.comparePassword = async function (
	checkPassword: string,
): Promise<boolean> {
	const isAMatch = await bcrypt.compare(checkPassword, this.password);
	return isAMatch;
};

UserSchema.methods.createJWT = function () {
	return jwt.sign({ userId: this._id }, config.jwt.secret, {
		expiresIn: config.jwt.lifetime,
	});
};

export default mongoose.model<IUserModel>("User", UserSchema);
