import mongoose from "mongoose";

export const APPLICATION_STATUS = [
  "applied",
  "under_review",
  "interview",
  "offer",
  "rejected",
];

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.Mixed, required: true },
    postedJob: { type: mongoose.Schema.Types.ObjectId, ref: "PostedJob" },
    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    company: String,
    location: String,
    salary: String,
    employment_type: String,
    jobType: String,
    job_category: String,
    url: String,
    source: String,
    coverLetter: { type: String, default: "" },
    status: {
      type: String,
      enum: APPLICATION_STATUS,
      default: "applied",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

applicationSchema.index({ seeker: 1, jobId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
