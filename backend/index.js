import express, { request, response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { Article } from "./models/article.js";
import indexRoute from "./routes/indexRoute.js";
import cors from "cors";

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
