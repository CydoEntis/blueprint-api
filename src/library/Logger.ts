import chalk from "chalk";

export default class Logger {
	public static log = (args: any) => this.info(args);

	public static success = (args: any) => {
		chalk.green(
			`[${new Date().toLocaleDateString()}]|[SUCCESS]`,
			typeof args === "string" ? chalk.greenBright(args) : args,
		);
	};

	public static info = (args: any) => {
		chalk.blue(
			`[${new Date().toLocaleDateString()}]|[INFO]`,
			typeof args === "string" ? chalk.blueBright(args) : args,
		);
	};

	public static warn = (args: any) => {
		chalk.yellow(
			`[${new Date().toLocaleDateString()}]|[WARN]`,
			typeof args === "string" ? chalk.yellowBright(args) : args,
		);
	};

	public static error = (args: any) => {
		chalk.red(
			`[${new Date().toLocaleDateString()}]|[ERROR]`,
			typeof args === "string" ? chalk.redBright(args) : args,
		);
	};
}
