import controller from "../controllers/job.controller";
import express from "express";

const router = express.Router();

router.get("/get/:jobId", controller.getJob);
router.get("/get", controller.getJobs);
router.post("/add", controller.addJob);
// router.put("/update/:taskId", controller.updateTask);
// router.delete("/delete/:taskId", controller.deleteTask);
// router.delete("/delete", controller.deleteTask);

export default router;
