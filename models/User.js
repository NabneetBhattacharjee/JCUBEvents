import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

import envConfig from "../config/env";
import { roles } from "../config/app";

const userSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String, required: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: [roles.user, roles.admin, roles.owner],
      default: roles.user,
    },
  },

  { timestamps: true, strict: false }
);

// Instance methods
userSchema.statics.hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(parseInt(envConfig.salt_rounds));
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(error.message);
  }
};

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default mongoose.model("User", userSchema);
