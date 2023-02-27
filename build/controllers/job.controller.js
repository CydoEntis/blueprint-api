"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const Logger_1 = __importDefault(require("../library/Logger"));
const job_model_1 = __importDefault(require("../models/job.model"));
function addJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { position, company, location, jobType, description, createdAt } = req.body;
        console.log(req.body);
        if (!position ||
            !company ||
            !location ||
            !jobType ||
            !description ||
            !createdAt) {
            Logger_1.default.error("Please provide all values.");
            return res.status(404).json("Please provide all values.");
        }
        try {
            const job = yield job_model_1.default.create({
                position,
                company,
                location,
                jobType,
                description,
                createdAt,
            });
            return res.status(201).json({ job });
        }
        catch (error) {
            Logger_1.default.error(error);
            return res.status(500).json({ message: error });
        }
    });
}
function getJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobId = req.params.jobId;
        try {
            const job = yield job_model_1.default.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: "Job could not be found." });
            }
            return res.status(200).json({ job });
        }
        catch (error) {
            Logger_1.default.error(error.message);
            return res.status(404).json({ message: "Job could not be found" });
        }
    });
}
function getJobs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search, jobStatus, jobType, sort, page } = req.query;
        const limit = 8;
        const currPage = Number(page) || 1;
        const skip = (currPage - 1) * limit;
        console.log(req.query);
        const queryObject = {};
        if (jobStatus && jobStatus !== "all") {
            queryObject.jobStatus = jobStatus;
        }
        if (jobStatus && jobType !== "all") {
            queryObject.jobType = jobType;
        }
        if (search) {
            queryObject.position = { $regex: search, $options: "i" };
        }
        try {
            let result = job_model_1.default.find(queryObject);
            const allJobs = yield job_model_1.default.find({});
            let pending = 0;
            let declined = 0;
            let interview = 0;
            for (let j of allJobs) {
                const jobStatus = j.jobStatus;
                if (jobStatus === "pending") {
                    pending++;
                }
                else if (jobStatus === "declined") {
                    declined++;
                }
                else if (jobStatus === "interview") {
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
            const jobs = yield result;
            const totalJobs = yield job_model_1.default.countDocuments(queryObject);
            const numOfPages = Math.ceil(totalJobs / limit);
            console.log(jobs);
            if (!jobs) {
                return res.status(404).json({ message: "No jobs could be found." });
            }
            res
                .status(200)
                .json({ jobs, pending, declined, interview, totalJobs, numOfPages });
        }
        catch (error) {
            return res.status(404).json({ message: "No jobs could be found." });
        }
    });
}
function updateJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { _id, position, company, location, jobType, jobStatus, interviewDate, } = req.body;
        console.log(_id);
        try {
            const jobExists = yield job_model_1.default.findById(_id);
            if (!jobExists) {
                return res.status(404).json({ message: "Job could not be found" });
            }
            let updatedInterviewDate = interviewDate;
            if (jobStatus !== "interview") {
                updatedInterviewDate = null;
            }
            const updatedJob = yield job_model_1.default.findOneAndUpdate({ _id }, {
                position,
                company,
                location,
                jobType,
                jobStatus,
                interviewDate: updatedInterviewDate,
            });
            console.log(updatedJob);
            return res.status(200).json({ updatedJob });
        }
        catch (error) {
            Logger_1.default.error(error);
            return res.status(404).json({ message: "Job could not be updated" });
        }
    });
}
function deleteJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobId = req.params.jobId;
        try {
            yield job_model_1.default.findByIdAndDelete(jobId);
            return res
                .status(201)
                .json({ message: `Job with id: ${jobId} was deleted.` });
        }
        catch (error) {
            Logger_1.default.error(error);
            return res
                .status(404)
                .json({ message: `Job with id: ${jobId} could not be deleted.` });
        }
    });
}
function getMonthlyApps(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let monthlyApplications = yield job_model_1.default.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: { $dateFromString: { dateString: "$createdAt" } } },
                        month: { $month: { $dateFromString: { dateString: "$createdAt" } } },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } },
            { $limit: 6 },
        ]);
        monthlyApplications = monthlyApplications
            .map((item) => {
            const { _id: { year, month }, count, } = item;
            const date = (0, moment_1.default)()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count };
        })
            .reverse();
        console.log(monthlyApplications);
        return res.status(200).json({ monthlyApplications });
    });
}
exports.default = {
    addJob,
    getJobs,
    getJob,
    updateJob,
    deleteJob,
    getMonthlyApps,
};
