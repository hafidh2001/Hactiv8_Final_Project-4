// import library
import dotenv from "dotenv";

// use dotenv
dotenv.config();

const port = process.env.PORT;
const node_env = process.env.NODE_ENV;
const database_url = process.env.DATABASE_URL;
const jwt_secret = process.env.JWT_SECRET;

export { port, database_url, node_env, jwt_secret };
