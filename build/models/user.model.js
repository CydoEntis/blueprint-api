"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: [true, "Please provide a username"] },
    password: {
        type: String,
        select: false,
        required: [true, "Please provide a password"],
    },
    email: { type: String, required: [true, "Please provide a valid email"] },
    // avatar: { type: String },
}, {
    timestamps: true,
    versionKey: false,
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            return next();
        }
        const salt = yield bcryptjs_1.default.genSalt(config_1.config.saltRounds);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
        return next();
    });
});
UserSchema.methods.comparePassword = function (checkPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAMatch = yield bcryptjs_1.default.compare(checkPassword, this.password);
        return isAMatch;
    });
};
UserSchema.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ userId: this._id }, config_1.config.jwt.secret, {
        expiresIn: config_1.config.jwt.lifetime,
    });
};
exports.default = mongoose_1.default.model("User", UserSchema);
