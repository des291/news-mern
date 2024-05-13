import express, { request, response } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import { Article } from "./models/article.js";

const app = express();

// Middleware for parsing request body
app.use(express.json());

app.get("/", async (request, response) => {
  try {
    const articles = await Article.find({});
    return response.status(200).json(articles);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

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
