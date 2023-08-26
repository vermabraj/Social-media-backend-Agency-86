const express = require("express");
const { UserModel } = require("../Models/User.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../Middlewares/authenticate.middleware");
const { postModel } = require("../Models/Post.model");
const UserRouter = express.Router();

UserRouter.post("/register", async (req, res) => {
  const { name, email, password, bio } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) res.send({ msg: "something went wrong" });
      else {
        const user = new UserModel({
          name,
          email,
          bio,
          password: hash,
        });
        await user.save();
        res.send({ msg: "user registered successfully" });
      }
    });
  } catch (err) {
    res.send({
      msg: "something went wrong with registering user",
      error: err.message,
    });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, async (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "masai");
          res.send({
            _id: user[0]._id,
            name: user[0].first_name,
            email: user[0].email,
            token: token,
          });
        } else {
          res.send({ msg: "wrong password" });
        }
      });
    } else {
      res.send({ msg: "user not found" });
    }
  } catch (err) {
    res.send({
      msg: "something went wrong with registering user",
      error: err.message,
    });
  }
});

UserRouter.put("/update/:id", authenticate, async (req, res) => {
  const ID = req.params.id;
  try {
    const post = await UserModel.find({ _id: ID, user: req.body.user });
    if (post.length > 0) {
      await UserModel.findByIdAndUpdate({ _id: ID }, req.body);
      res.send({ message: "User updated successfully" });
    } else {
      res.status(405).send({ message: "Method Not Allowed by this User" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Something went wrong", error: err });
  }
});

// LOGOUT
UserRouter.post("/logout", async (req, res) => {
  try {
    res.send({ message: "Logged Out" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

// GET total number of users
UserRouter.get("/analytics/users", async (req, res) => {
  try {
    const userCount = await UserModel.countDocuments({});
    res.json({ totalUsers: userCount });
  } catch (error) {
    res.status(500).send("Error retrieving total users count", error.message);
  }
});

// GET top 5 most active users based on number of posts
UserRouter.get("/analytics/users/top-active", async (req, res) => {
  try {
    const users = await postModel.aggregate([
      {
        $group: {
          _id: "$user",
          postCount: { $sum: 1 },
        },
      },
      {
        $sort: { postCount: -1 },
      },
      {
        $limit: 5, //limit the users
      },
      {
        $lookup: {
          from: "users", // assuming the collection name is "users"
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userDetails.name",
          postCount: 1,
        },
      },
    ]);

    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error retrieving top active users");
  }
});


module.exports = { UserRouter };
