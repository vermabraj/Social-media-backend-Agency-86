const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "product" },
    content: {
      type: String,
      required: true,
      min:1,
      max: 300,
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "user", default: [] }],
  },
  {
    versionKey: false,
  }
);

const postModel = model("post", postSchema);

module.exports = { postModel };
