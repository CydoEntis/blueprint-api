import controller from "../controllers/user.controller";
import express from "express";

const router = express.Router();

router.get("/get/:userId", controller.getUser);
router.get("/get", controller.getUsers);
router.post("/create", controller.createUser);
router.post("/login", controller.loginUser);

export default router;
