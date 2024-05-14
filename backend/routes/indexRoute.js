import express from "express";
import { Article } from "../models/article.js";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const articles = await Article.find({});
    return response.status(200).json(articles);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
