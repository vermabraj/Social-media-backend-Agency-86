const express = require("express");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../Middlewares/authenticate.middleware");
const { postModel } = require("../Models/Post.model");
const { UserModel } = require("../Models/User.model");

const postRouter = express.Router();


postRouter.get("/", async (req, res) => {
  try {
    const data = await postModel
      .find()
      .populate("user", ["name", "email"])
      .sort({ createdAt: -1 });
    res.send(data);
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong", error: err });
  }
});


postRouter.get("/:id", async (req, res) => {
  const ID = req.params.id;
  try {
    const data = await postModel
      .findById({ _id: ID })
      .populate("user", ["name", "email"]);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Something went wrong", error: err });
  }
});


postRouter.post("/create", authenticate, async (req, res) => {
  try {
    const post_to_add = new postModel(req.body);
    await post_to_add.save();
    res.send({ message: "Post created Successfully" });
  } catch (error) {
    console.log(err);
    res.send({ message: "Something went wrong", error: err });
  }
});


postRouter.patch("/update/:id", authenticate, async (req, res) => {
  const ID = req.params.id;
  try {
    const post = await postModel.find({ _id: ID, author: req.body.author });
    if (post.length > 0) {
      await postModel.findByIdAndUpdate({ _id: ID }, req.body);
      res.send({ message: "Post updated successfully" });
    } else {
      res.status(405).send({ message: "Method Not Allowed by this User" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong", error: err });
  }
});


postRouter.delete("/delete/:id", authenticate, async (req, res) => {
  const ID = req.params.id;
  try {
    const post = await postModel.find({ _id: ID, user: req.body.user });
    if (post.length > 0) {
      await postModel.findByIdAndDelete({ _id: ID });
      res.send({ message: "Post deleted successfully" });
    } else {
      res.status(405).send({ message: "Method Not Allowed by this User" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong", error: err });
  }
});


postRouter.put("/likes/:id", authenticate, async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);

    const isLiked = post.likes.filter(
      (user) => user.toString() === req.body.User
    );

    if (isLiked.length == 0) {
      post.likes.unshift(req.body.user);
      await post.save();
      res.send({ msg: "Liked successfully", likes: post.likes });
    } else {
      let removeIndex = post.likes
        .map((user) => user.toString())
        .indexOf(req.body.user);

      post.likes.splice(removeIndex, 1);

      await post.save();
      res.send({ msg: "Unliked successfully", likes: post.likes });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal Server error");
  }
});

module.exports = { postRouter };
