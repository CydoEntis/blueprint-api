import controller from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/get/:userId", controller.getUser);
router.get("/get", controller.getUsers);
router.post("/create", controller.createUser);
router.post("/login", controller.loginUser);
router.delete("/delete", controller.deleteUser);

export default router;
