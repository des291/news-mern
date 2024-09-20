import express, { request, response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { News, Sport } from "./models/article.js";
import indexRoute from "./routes/indexRoute.js";
import cors from "cors";
import { spawn, exec } from "child_process";
import schedule from "node-schedule";
import helmet from "helmet";
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";

// Schedule scraper.py to run at 06:00 and 17:00
const rule = new schedule.RecurrenceRule();
rule.tz = "Europe/London";
rule.hour = [6, 17];
rule.minute = 0;
rule.second = 0;
const scraper = schedule.scheduleJob(rule, () => {
  console.log("Scraper schedule has been triggered");
  // spawn("scraper/venv/bin/python", ["scraper/scraper.py"]);
  exec(
    ". ./scraper/venv/bin/activate && python ./scraper/scraper.py",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      console.log("Articles updated " + new Date().toString());
    },
  );
});

const app = express();
const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/api.fast-news.xyz/privkey.pem"),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/api.fast-news.xyz/fullchain.pem",
  ),
};
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

// Middleware for parsing request body
app.use(express.json());

// Middleware for handling CORS policy
// app.use(cors());
app.use(
  cors({
    origin: "https://www.fast-news.xyz",
  }),
);

app.use(helmet());

app.use("/", indexRoute);

// Specific middleware for serving .well-known directory
const __dirname = import.meta.dirname;
const acmeChallengePath = path.join(__dirname, ".well-known/acme-challenge");
app.use("/.well-known/acme-challenge", express.static(acmeChallengePath));

mongoose
  .connect(process.env.ATLAS_URI, { dbName: "articles" })
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
