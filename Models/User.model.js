const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 1,
      max: 50,
    },

    email: { type: String, required: true, min: 4, unique: true },

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      required: true,
      max: 200,
    },
    saved_posts: [{ type: Schema.Types.ObjectId, ref: "post", default: [] }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = model("user", UserSchema);
module.exports = { UserModel };
