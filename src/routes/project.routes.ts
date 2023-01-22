import controller from "../controllers/project.controller";
import express from "express";

const router = express.Router();

router.post("/get/:projectId", controller.createProject);
router.post("/create", controller.createProject);
router.post("/update/:projectId", controller.createProject);
router.post("/delete/:projectId", controller.createProject);

export default router;
