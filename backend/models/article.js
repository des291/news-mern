import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    guardian_link: {
      type: String,
      required: true,
    },
    datestamp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const News = mongoose.model("News", articleSchema, "news");
export const Sport = mongoose.model("Sport", articleSchema, "sport");
