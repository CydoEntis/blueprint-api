import controller from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.post("/create", controller.createUser);
router.post("/login", controller.loginUser);
router.get("/get/userId", controller.getUser);
router.get("/get", controller.getUsers);

export default router;
