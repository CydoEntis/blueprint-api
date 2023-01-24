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

async function loginUser(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		throw Error("Please provide all values");
	}

	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			throw Error("Invalid email or password.");
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			throw Error("Invalid email or password");
		}

		const token = user.createJWT();
		user.password = undefined;

		return res.status(200).json({ user, token });
	} catch (error: any) {
		Logger.error(error);
		return res.status(404).json({ message: error });
	}
}

async function getUser(req: Request, res: Response) {
	const userId = req.params.userId;

	try {
		const user = await User.findById(userId).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User could not be found." });
		}

		return res.status(200).json({ user });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "User count not be found" });
	}
}

async function getUsers(req: Request, res: Response) {
	try {
		const user = await User.find({}).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User could not be found." });
		}

		return res.status(200).json({ user });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "User count not be found" });
	}
}

export default {
	createUser,
	loginUser,
};
