const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "product" },
    content: {
      type: String,
      required: true,
      min: 1,
      max: 300,
    },

    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const postModel = model("post", postSchema);

module.exports = { postModel };
