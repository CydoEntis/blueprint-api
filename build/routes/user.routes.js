"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/get/:userId", user_controller_1.default.getUser);
router.post("/create", user_controller_1.default.createUser);
router.post("/login", user_controller_1.default.loginUser);
exports.default = router;
