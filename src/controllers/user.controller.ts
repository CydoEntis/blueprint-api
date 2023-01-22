import { NextFunction, Request, Response } from "express";

import Logger from "../library/Logger";
import User from "../models/user.model";
import mongoose from "mongoose";

async function createUser(req: Request, res: Response, next: NextFunction) {
	const { username, email, firstName, lastName, password, avatar } = req.body;

	if (!username || !email || !firstName || !lastName || !password || !avatar) {
		throw Error("Please provide all values.");
	}

	const userAlreadyExists = await User.findOne({ email });

	if (userAlreadyExists) {
		throw Error("User with this email already exists");
	}

	const user = await User.create({
		username,
		password,
		email,
		firstName,
		lastName,
		avatar,
	});

	const token = user.createJWT();

	return res.status(200).json({
		user,
		token,
	});
}

export default {
	createUser,
};
