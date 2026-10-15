import mongoose from "mongoose";

const postedJobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employment_type: { type: String, default: "full-time" },
    jobType: { type: String, default: "Full Time" },
    job_category: { type: String, default: "General" },
    salary: { type: String, default: "" },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PostedJob", postedJobSchema);
