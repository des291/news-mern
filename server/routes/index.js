import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = db.collection("articles-collection");
  let articles = await collection.find({}).toArray();
  res.send(articles).status(200);
});

export default router;
