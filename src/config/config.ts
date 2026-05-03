import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  DATABASE_URL,
} = process.env;

const config = {
  port: PORT || 80,
  databaseUrl: DATABASE_URL,
};

export default config;