import controller from "../controllers/project.controller";
import express from "express";

const router = express.Router();

router.post("/create", controller.createProject);

export default router;
