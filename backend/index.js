import express, { request, response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { Article } from "./models/article.js";
import indexRoute from "./routes/indexRoute.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

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
