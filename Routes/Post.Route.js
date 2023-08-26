const { Router } = require("express");
const { authenticate } = require("../Middlewares/authenticate.middleware");
const { postModel } = require("../Models/Post.model");
const postRouter = Router();

// postRouter.use(authenticate)
postRouter.get("/", authenticate, async (req, res) => {
  const { user } = req.body;

  try {
    await postModel.find({ user })
      .populate("productId")
      .then((r) => {
        return res.status(200).send(r);
      });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

postRouter.post("/add", authenticate, async (req, res) => {
  const productId = req.body;
  let { user } = req.body;

  try {
    let cartItem = new postModel({ user });

    await postModel.insertMany(req.body);
    return res.status(200).send(cartItem);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

postRouter.patch("/update/:id", authenticate, async (req, res) => {
  const _id = req.params.id;
  const payload = req.body;
  try {
    await postModel.findOneAndUpdate({ _id }, payload);
    res.send({ msg: `Product with id:${_id} has been updated` });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

postRouter.delete("/delete/:id", authenticate, async (req, res) => {
  const _id = req.params.id;

  try {
    await postModel.findOneAndDelete({ _id });
    res.send({ msg: `Product with id:${_id} has been deleted` });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = { postRouter };
