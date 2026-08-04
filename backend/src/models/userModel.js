import mongoose from "mongoose";

const jobSnapshotSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    title: String,
    company: String,
    location: String,
    salary: String,
    employment_type: String,
    jobType: String,
    job_category: String,
    url: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    savedJobs: { type: [jobSnapshotSchema], default: [] },
    appliedJobs: { type: [jobSnapshotSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
