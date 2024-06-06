import express, { request, response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { Article } from "./models/article.js";
import indexRoute from "./routes/indexRoute.js";
import cors from "cors";
import { spawn } from "child_process";
import schedule from "node-schedule";
import helmet from "helmet";
import http from "http";
import https from "https";
import fs from "fs";

// Schedule scraper.py to run at 06:00 and 17:00
const rule = new schedule.RecurrenceRule();
rule.tz = "Europe/London";
rule.hour = [6, 17];
rule.minute = 0;
rule.second = 0;
const scraper = schedule.scheduleJob(rule, () => {
  spawn("python", ["/scraper/scraper.py"]);
});

const app = express();

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("server.crt"),
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

app.use(helmet());

app.use("/", indexRoute);

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    console.log("App connected to database");
    httpServer.listen(process.env.HTTP_PORT, () => {
      console.log(`HTTP is listening to port: ${process.env.HTTP_PORT}`);
    });
    httpsServer.listen(process.env.HTTPS_PORT, () => {
      console.log(`HTTPS is listening to port: ${process.env.HTTPS_PORT}`);
    });
  })
  .catch(() => {
    console.log(error);
  });
