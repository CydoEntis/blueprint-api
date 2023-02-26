import { Request, Response } from "express";
import { SortOrder } from "mongoose";

import Logger from "../library/Logger";
import Job from "../models/job.model";

async function addJob(req: Request, res: Response) {
  const { position, company, location, jobType, description, createdAt } =
    req.body;

  console.log(req.body);

  if (
    !position ||
    !company ||
    !location ||
    !jobType ||
    !description ||
    !createdAt
  ) {
    Logger.error("Please provide all values.");
    return res.status(404).json("Please provide all values.");
  }

  try {
    const job = await Job.create({
      position,
      company,
      location,
      jobType,
      description,
      createdAt,
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

interface ISearch {
  search?: string;
  jobStatus?: string;
  jobType?: string;
  sort?: string;
  position?: { $regex: string; $options: string };
}

async function getJobs(req: Request, res: Response) {
  const { search, jobStatus, jobType, sort, page } = req.query;
  const limit = 8;
  const currPage = Number(page) || 1;
  const skip = (currPage - 1) * limit;

  console.log(req.query);

  const queryObject: ISearch = {};

  if (jobStatus && jobStatus !== "all") {
    queryObject.jobStatus = jobStatus as string;
  }

  if (jobStatus && jobType !== "all") {
    queryObject.jobType = jobType as string;
  }

  if (search) {
    queryObject.position = { $regex: search as string, $options: "i" };
  }

  try {
    let result = Job.find(queryObject);

	const allJobs = await Job.find({});

    let pending = 0;
    let declined = 0;
    let interview = 0;

    for (let j of allJobs) {
      const jobStatus = j.jobStatus;
      if (jobStatus === "pending") {
        pending++;
      } else if (jobStatus === "declined") {
        declined++;
      } else if (jobStatus === "interview") {
        interview++;
      }
    }

    if (sort === "oldest") {
      result.sort("createdAt");
    }

    if (sort === "newest") {
      result.sort("-createdAt");
    }

    if (sort === "a-z") {
      result.sort("position");
    }

    if (sort === "z-a") {
      result.sort("-position");
    }

    //   let sortVal: unknown;
    //   if (sort === "oldest") {
    //     sortVal = { createdAt: 1 as SortOrder };
    //   } else if (sort === "newest") {
    //     sortVal = { createdAt: -1 as SortOrder };
    //   } else if (sort === "z-a") {
    //     sortVal = { position: -1 as SortOrder };
    //   } else if (sort === "a-z") {
    //     sortVal = { position: 1 as SortOrder };
    //   }

    //     let jobs;
    //     if (search === "" && jobStatus === "all" && jobType === "all") {
    //       jobs = await Job.find({}).sort(sortVal as [string, SortOrder][]);
    //     } else if (search === "" && jobStatus !== "all" && jobType !== "all") {
    //       jobs = await Job.find({ jobStatus: jobStatus, jobType: jobType }).sort(
    //         sortVal as [string, SortOrder][]
    //       );
    //     } else if (search === "" && jobStatus !== "all" && jobType === "all") {
    //       jobs = await Job.find({ jobStatus: jobStatus }).sort(
    //         sortVal as [string, SortOrder][]
    //       );
    //     } else if (search === "" && jobStatus === "all" && jobType !== "all") {
    //       jobs = await Job.find({ jobType: jobType }).sort(
    //         sortVal as [string, SortOrder][]
    //       );
    //     } else if (search !== "" && jobStatus === "all" && jobType === "all") {
    //       jobs = await Job.find({$text: {$search: search as string}}).sort(sortVal as [string, SortOrder][]);
    //     } else if (search !== "" && jobStatus !== "all" && jobType !== "all") {
    //       jobs = await Job.find({$text: {$search: search as string}, jobStatus: jobStatus, jobType: jobType }).sort(
    //         sortVal as [string, SortOrder][]
    //       );
    //     } else if (search !== "" && jobStatus !== "all" && jobType === "all") {
    //       jobs = await Job.find({$text: {$search: search as string}, jobStatus: jobStatus }).sort(
    //         sortVal as [string, SortOrder][]
    //       );
    //     } else if (search !== "" && jobStatus === "all" && jobType !== "all") {
    //       jobs = await Job.find({$text: {$search: search as string}, jobType: jobType }).sort(
    //         sortVal as [string, SortOrder][]
    //       );
    //     }
	result = result.skip(skip).limit(limit);
	
	const jobs = await result;

	const totalJobs = await Job.countDocuments(queryObject);
	const numOfPages = Math.ceil(totalJobs / limit);

    console.log(jobs);
    if (!jobs) {
      return res.status(404).json({ message: "No jobs could be found." });
    }


    res.status(200).json({ jobs, pending, declined, interview, totalJobs, numOfPages });
  } catch (error: any) {
    return res.status(404).json({ message: "No jobs could be found." });
  }
}

async function updateJob(req: Request, res: Response) {
  const {
    _id,
    position,
    company,
    location,
    jobType,
    jobStatus,
    interviewDate,
  } = req.body;
  console.log(_id);
  try {
    const jobExists = await Job.findById(_id);

    if (!jobExists) {
      return res.status(404).json({ message: "Job could not be found" });
    }

    let updatedInterviewDate = interviewDate;
    if (jobStatus !== "interview") {
      updatedInterviewDate = null;
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id },
      {
        position,
        company,
        location,
        jobType,
        jobStatus,
        interviewDate: updatedInterviewDate,
      }
    );
    console.log(updatedJob);

    return res.status(200).json({ updatedJob });
  } catch (error: any) {
    Logger.error(error);
    return res.status(404).json({ message: "Job could not be updated" });
  }
}

async function deleteJob(req: Request, res: Response) {
  const jobId = req.params.jobId;

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
  deleteJob,
};
