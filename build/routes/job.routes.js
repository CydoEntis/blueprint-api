"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/get/:jobId", job_controller_1.default.getJob);
router.get("/all", job_controller_1.default.getJobs);
router.get("/apps", job_controller_1.default.getMonthlyApps);
router.post("/add", job_controller_1.default.addJob);
router.put("/update/:jobId", job_controller_1.default.updateJob);
router.delete("/delete/:jobId", job_controller_1.default.deleteJob);
exports.default = router;
