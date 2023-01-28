import { NextFunction, Request, Response } from "express";

import Logger from "../library/Logger";
import User from "../models/user.model";
import mongoose from "mongoose";

async function createUser(req: Request, res: Response, next: NextFunction) {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
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
		// avatar,
	});

	// const token = user.createJWT();

	return res.status(200).json({
		message: "Account created successfully. Please Log in.",
	});
}

async function loginUser(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(401).json("Please provide all values");
	}

	try {
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			return res.status(401).json({ message: "Invalid email or password" });
		}

		const token = user.createJWT();
		user.password = undefined;

		return res.status(200).json({ user, token });
	} catch (error: any) {
		Logger.error(error);
		console.log(error);
		return res.status(404).json({ message: error });
	}
}

async function getUser(req: Request, res: Response) {
	const userId = req.params.userId;
	console.log(userId);
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
		const users = await User.find({}).select("-password");

		if (!users) {
			return res.status(404).json({ message: "Users could not be found." });
		}

		console.log(users);

		return res.status(200).json({ users });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "Users count not be found" });
	}
}

async function deleteUser(req: Request, res: Response) {
	const userId = req.params.userId;
	try {
		await User.findByIdAndDelete(userId);

		return res
			.status(201)
			.json({ message: `User with id: ${userId} was deleted` });
	} catch (error: any) {
		Logger.error(error);
		return res
			.status(404)
			.json({ message: `Task with id: ${userId} could not be deleted.` });
	}
}

export default {
	createUser,
	loginUser,
	getUser,
	getUsers,
	deleteUser,
};
