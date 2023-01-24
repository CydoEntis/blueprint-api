import controller from "../controllers/project.controller";
import express from "express";

const router = express.Router();

router.get("/get/:projectId", controller.getProject);
router.get("/get", controller.getProjects);
router.post("/create", controller.createProject);
router.put("/update/:projectId", controller.updateProject);
router.delete("/delete/:projectId", controller.deleteProject);

export default router;
