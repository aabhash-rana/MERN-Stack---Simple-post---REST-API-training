/** Reference code: https://github.com/bpeddapudi/nodejs-basics-routes/blob/master/server.js
 * import express */
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";

const express = require("express"); // import express
const cors = require("cors"); // import cors
const dotenv = require("dotenv"); // import dotenv
const mongoose = require("mongoose");

// middleware
const app = express(); // initialize express
app.use(express.json()); // to parse the body of the request
app.use(cors()); // to allow cross-origin requests
dotenv.config(); // to use .env file

const options = {
  keepAlive: true,
  connectTimeoutMS: 10000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbUrl = process.env.DB_URI; // get the db url from .env file
const PORT = process.env.PORT; // get the port from .env file

// Mongo DB connection
mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

// Validate DB connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongo DB Connected successfully");
});

// Schema for Post
let Schema = mongoose.Schema;
let postSchema = new Schema(
  {
    id: {
      type: Number,
    },
    content: { type: String },
  },
  { timestamps: true }
);

let postModel = mongoose.model("post", postSchema);

app.get("/", (req, res) => {
  res.send("Your are lucky!! server is running...");
});

/** GET API: GETs Books from DB and returns as response */
app.get("/posts", async (req, res) => {
  try {
    let posts = await postModel.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

/** POST API: Gets new book info from React and adds it to DB */
app.post("/posts", async (req, res) => {
  const inputPost = req.body;

  try {
    let post = new postModel(inputPost);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

/** DELETE API: Gets ID of the book to be deleted from React and deletes the book in db.
 * Sends 400 if there is no book with given id
 * Sends 500 if there is an error while saving data to DB
 * Sends 200 if deleted successfully
 */
app.delete("/posts/:postId", async (req, res) => {
  try {
    let post = await postModel.findByIdAndRemove(req.params.postId);
    if (post) {
      res.status(200).json({
        status: 200,
        message: "Post deleted successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No Post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
