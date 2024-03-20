import mongoose, { Schema } from "mongoose";
import { eventTypes } from "../config/app";

const eventSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date },
    start_time: { type: String, required: true },
    end_time: { type: String },
    address: { type: String },
    location: { type: String, required: true },
    qrCode: { type: String },
    registrations: [
      {
        student: { type: mongoose.Types.ObjectId, ref: "Student" },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        date: { type: Date, default: Date.now },
      },
    ],
    logo: {
      name: { type: String, required: true },
      path: { type: String, required: true },
    },
    type: {
      type: String,
      enum: [eventTypes.free, eventTypes.paid],
      required: true,
    },
    is_active: { type: Boolean, default: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model("Event", eventSchema);
