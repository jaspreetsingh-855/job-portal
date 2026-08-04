export const localJobs = [
  {
    id: 1,
    title: "React Developer",
    company: "Google",
    location: "Chandigarh",
    jobType: "Full Time",
    employment_type: "full-time",
    job_category: "Frontend",
  },
  {
    id: 2,
    title: "Node Developer",
    company: "Microsoft",
    location: "Delhi",
    jobType: "Remote",
    employment_type: "remote",
    is_remote_work: 1,
    job_category: "Backend",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "Amazon",
    location: "Noida",
    jobType: "Internship",
    employment_type: "internship",
    job_category: "Frontend",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "TCS",
    location: "Bangalore",
    jobType: "Part Time",
    employment_type: "part-time",
    job_category: "Backend",
  },
];

export function mapRemotiveJob(job) {
  return {
    id: job.id,
    title: job.title,
    company: job.company_name,
    location: job.candidate_required_location || "Remote",
    jobType: job.job_type || "Remote",
    employment_type: job.job_type || "remote",
    is_remote_work: 1,
    job_category: job.category || "General",
    salary: job.salary || "",
    url: job.url || "",
  };
}

export async function getAllJobs() {
  try {
    const response = await fetch("https://remotive.com/api/remote-jobs", {
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      throw new Error(`Remotive HTTP ${response.status}`);
    }

    const data = await response.json();
    const list = Array.isArray(data.jobs) ? data.jobs : [];

    if (list.length === 0) {
      return localJobs;
    }

    return list.map(mapRemotiveJob);
  } catch (error) {
    console.warn("Remotive unavailable, using local jobs:", error.message);
    return localJobs;
  }
}

export async function findJobById(id) {
  const allJobs = await getAllJobs();
  return allJobs.find((job) => String(job.id) === String(id));
}
