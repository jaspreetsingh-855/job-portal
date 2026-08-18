import mongoose from "mongoose";

export const ROLES = {
  JOBSEEKER: "jobseeker",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

const jobSnapshotSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.Mixed, required: true },
    title: String,
    company: String,
    location: String,
    salary: String,
    employment_type: String,
    jobType: String,
    job_category: String,
    url: String,
    source: String,
    status: {
      type: String,
      enum: ["applied", "under_review", "interview", "offer", "rejected"],
      default: "applied",
    },
    appliedAt: { type: Date, default: Date.now },
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
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, trim: true, default: "" },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.JOBSEEKER,
      required: true,
    },
    companyName: { type: String, trim: true, default: "" },
    savedJobs: { type: [jobSnapshotSchema], default: [] },
    appliedJobs: { type: [jobSnapshotSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
