import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    course:{type:String},
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    reg_active: { type: Boolean, default: false },
    reg_event: {
      type: mongoose.Types.ObjectId,
      ref: "Event",
      default: undefined,
    },
  },

  { timestamps: true, strict: false }
);

export default mongoose.model("Student", studentSchema);
