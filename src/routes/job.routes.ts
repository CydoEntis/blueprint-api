import controller from "../controllers/job.controller";
import express from "express";

const router = express.Router();

router.get("/get/:jobId", controller.getJob);
router.get("/all", controller.getJobs);
router.get("/apps", controller.getMonthlyApps);
router.post("/add", controller.addJob);
router.put("/update/:jobId", controller.updateJob);
router.delete("/delete/:jobId", controller.deleteJob);

export default router;
