import controller from "../controllers/task.controller";
import express from "express";

const router = express.Router();

router.get("/get/:taskId", controller.getTask);
router.get("/get", controller.getTasks);
router.post("/create", controller.createTask);
router.put("/update/:taskId", controller.updateTask);
router.delete("/delete/:taskId", controller.deleteTask);
router.delete("/delete", controller.deleteTask);

export default router;
