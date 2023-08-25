const express = require("express");
const cors = require("cors");
const app = express();
const { connection } = require("./db");


require("dotenv").config();
app.use(express.json());

app.use(cors());
app.get("/", (req, res) => {
  res.send("Welcome to Agency-86 Home page");
});


app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log("Server is running at port 4500");
});
