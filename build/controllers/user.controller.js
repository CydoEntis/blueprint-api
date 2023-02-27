"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../library/Logger"));
const user_model_1 = __importDefault(require("../models/user.model"));
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            throw Error("Please provide all values.");
        }
        const userAlreadyExists = yield user_model_1.default.findOne({ email });
        if (userAlreadyExists) {
            throw Error("User with this email already exists");
        }
        const user = yield user_model_1.default.create({
            username,
            password,
            email,
            // avatar,
        });
        // const token = user.createJWT();
        return res.status(200).json({
            message: "Account created successfully. Please Log in.",
        });
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json("Please provide all values");
        }
        try {
            const user = yield user_model_1.default.findOne({ email }).select("+password");
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const isPasswordCorrect = yield user.comparePassword(password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = user.createJWT();
            user.password = undefined;
            return res.status(200).json({ user, token });
        }
        catch (error) {
            Logger_1.default.error(error);
            console.log(error);
            return res.status(404).json({ message: error });
        }
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        try {
            const user = yield user_model_1.default.findById(userId).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User could not be found." });
            }
            return res.status(200).json({ user });
        }
        catch (error) {
            Logger_1.default.error(error.message);
            return res.status(404).json({ message: "User count not be found" });
        }
    });
}
exports.default = {
    createUser,
    loginUser,
    getUser,
};
