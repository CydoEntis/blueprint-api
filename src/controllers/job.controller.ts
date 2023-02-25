import { Request, Response } from "express";

import Logger from "../library/Logger";
import Job from "../models/job.model";

async function addJob(req: Request, res: Response) {
	console.log(req.body)
	const {
		position,
		company,
		location,
		jobType,
		description
	} = req.body;

	if (!position || !company || !location || !jobType || !description ) {
		Logger.error("Please provide all values.");
		return res.status(404).json("Please provide all values.");
	}

	try {
		const job = await Job.create({
			position,
			company,
			location,
			jobType,
			description
		});

		return res.status(201).json({ job });
	} catch (error: any) {
		Logger.error(error);
		return res.status(500).json({ message: error });
	}
}

async function getJob(req: Request, res: Response) {
	const jobId = req.params.jobId;

	try {
		const job = await Job.findById(jobId);

		if (!job) {
			return res.status(404).json({ message: "Job could not be found." });
		}

		return res.status(200).json({ job });
	} catch (error: any) {
		Logger.error(error.message);
		return res.status(404).json({ message: "Job could not be found" });
	}
}

async function getJobs(req: Request, res: Response) {
	try {
		const jobs = await Job.find({}).sort({createdAt: -1});

		if (!jobs) {
			return res.status(404).json({ message: "No jobs could be found." });
		}

		res.status(200).json({ jobs });
	} catch (error: any) {
		return res.status(404).json({ message: "No jobs could be found." });
	}
}

async function updateJob(req: Request, res: Response) {
	const jobId = req.params.jobId;
	const { position, company, location, jobType, jobStatus, } = req.body;
	try {
		const jobExists = await Job.findById(jobId);

		if (!jobExists) {
			return res.status(404).json({ message: "Job could not be found" });
		}

		const updatedJob = await Job.findOneAndUpdate({ jobId }, {
			position,
			company,
			location,
			jobType,
			jobStatus
		});

		return res.status(200).json({ updatedJob });
	} catch (error: any) {
		Logger.error(error);
		return res.status(404).json({ message: "Job could not be updated" });
	}
}

async function deleteJob(req: Request, res: Response) {
	const jobId = req.params.jobId;
	console.log(req.params);

	try {
		await Job.findByIdAndDelete(jobId);

		return res
			.status(201)
			.json({ message: `Job with id: ${jobId} was deleted.` });
	} catch (error: any) {
		Logger.error(error);
		return res
			.status(404)
			.json({ message: `Job with id: ${jobId} could not be deleted.` });
	}
}

// async function deleteAllJobs(req: Request, res: Response) {
// 	const { projectId } = req.body;

// 	try {
// 		await Job.deleteMany({ projectId });

// 		return res
// 			.status(201)
// 			.json({ message: `Jobs with projectId: ${projectId} were deleted.` });
// 	} catch (error: any) {
// 		return res
// 			.status(404)
// 			.json({ message: `No jobs with projectId: ${projectId} were deleted.` });
// 	}
// }

export default {
	addJob,
	getJobs,
	getJob,
	updateJob,
	deleteJob
};