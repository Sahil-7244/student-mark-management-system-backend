import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import config from "./config/config";
import db from "./config/prismaDb";
import { router } from "./routes/router";
import { errorHandler } from "./utils/errorHandler";
import { createServer } from "http";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Port = config.port;

//database connected
db;

//routes
app.get("/", (req, res) => {
  res.send("Welcome to Student Mark Management API");
});
app.use("/students_marks_management/v1", router);

//error handler
app.use(errorHandler);

//server Start
httpServer.listen(Port, () => {
  console.log("server started on port", Port);
});
