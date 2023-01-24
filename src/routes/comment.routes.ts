import controller from "../controllers/comment.controller";
import express from "express";

const router = express.Router();

router.get("/get/:commentId", controller.getComment);
router.get("/get/", controller.getComments);
router.post("/create", controller.createComment);
router.put("/update/:commentId", controller.updateComment);
router.delete("/delete/:commentId", controller.deleteComment);
router.delete("/delete-all", controller.deleteAllComments);

export default router;
