"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
}
exports.default = Logger;
_a = Logger;
Logger.log = (args) => _a.info(args);
Logger.success = (args) => {
    console.log(chalk_1.default.green(`[${new Date().toLocaleDateString()}]|[SUCCESS]`, typeof args === "string" ? chalk_1.default.greenBright(args) : args));
};
Logger.info = (args) => {
    console.log(chalk_1.default.blue(`[${new Date().toLocaleDateString()}]|[INFO]`, typeof args === "string" ? chalk_1.default.blueBright(args) : args));
};
Logger.warn = (args) => {
    console.log(chalk_1.default.yellow(`[${new Date().toLocaleDateString()}]|[WARN]`, typeof args === "string" ? chalk_1.default.yellowBright(args) : args));
};
Logger.error = (args) => {
    console.log(chalk_1.default.red(`[${new Date().toLocaleDateString()}]|[ERROR]`, typeof args === "string" ? chalk_1.default.redBright(args) : args));
};
