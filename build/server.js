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
const express_1 = __importDefault(require("express"));
const Logger_1 = __importDefault(require("./library/Logger"));
const config_1 = require("./config/config");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
// Connect To MongoDB.
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.config.mongo.url, {
                retryWrites: true,
                w: "majority",
            });
            Logger_1.default.success("Connected to MongoDb");
            startServer();
        }
        catch (error) {
            Logger_1.default.error(error);
        }
    });
}
connectToDB();
function startServer() {
    app.use((req, res, next) => {
        Logger_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on("finish", () => {
            Logger_1.default.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${req.statusCode}]`);
        });
        next();
    });
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    // TODO: Add Routes...
    app.use("/user", user_routes_1.default);
    app.use("/jobs", job_routes_1.default);
    app.use((req, res, next) => {
        const error = new Error("Not Found");
        Logger_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    http_1.default
        .createServer(app)
        .listen(config_1.config.server.port, () => Logger_1.default.success(`Server is running on port: ${config_1.config.server.port}`));
}
