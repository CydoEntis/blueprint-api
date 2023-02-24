import controller from "../controllers/job.controller";
import express from "express";

const router = express.Router();

router.get("/get/:jobId", controller.getJob);
router.get("/all", controller.getJobs);
router.post("/add", controller.addJob);
router.put("/update/:jobId", controller.updateJob);
// router.delete("/delete/:taskId", controller.deleteTask);
// router.delete("/delete", controller.deleteTask);

export default router;
