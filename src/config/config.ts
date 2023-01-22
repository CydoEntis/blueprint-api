import dotenv from "dotenv";

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@projects.kepbsoo.mongodb.net/blueprint`;

const SERVER_PORT = process.env.SERVER_PORT
	? Number(process.env.SERVER_PORT)
	: 1337;

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_LIFETIME = process.env.JWT_LIFETIME || "";

export const config = {
	mongo: {
		url: MONGO_URL,
	},
	server: {
		port: SERVER_PORT,
	},
	jwt: {
		secret: JWT_SECRET,
		lifetime: JWT_LIFETIME,
	},
	saltRounds: 10,
};
