import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String, required: function () {
        return this.strategy !== 'google';
      }
    },
    googleId: {
      type: String
    },
    verificationCode: { type: String, required: function () {
      return this.strategy !== 'google';
    } },
    verified: { type: Boolean, default: false },
    strategy: {
      type: String,
      default: 'local'
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(normalize);
export const UserModel = model("User", userSchema);