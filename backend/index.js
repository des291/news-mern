import express, { request, response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { Article } from "./models/article.js";
import indexRoute from "./routes/indexRoute.js";
import cors from "cors";
import { spawn } from "child_process";
import schedule from "node-schedule";
import helmet from "helmet";

// Schedule scraper.py to run at 06:00 and 17:00
const rule = new schedule.RecurrenceRule();
rule.tz = "Europe/London";
rule.hour = [6, 17];
rule.minute = 0;
rule.second = 0;
const scraper = schedule.scheduleJob(rule, () => {
  spawn("./scraper/venv/bin/python", ["scraper/scraper.py"]);
});

const app = express();

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
    app.listen(process.env.PORT, () => {
      console.log(`App is listening to port: ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log(error);
  });
