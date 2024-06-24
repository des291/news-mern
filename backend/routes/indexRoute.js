import express from "express";
import { News, Sport } from "../models/article.js";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const news = await News.find({});
    const sport = await Sport.find({});
    return response.status(200).json({ news: news, sport: sport });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
