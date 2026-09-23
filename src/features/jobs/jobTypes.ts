export type JobType = "full_time" | "part_time" | "contract" | "internship";

export type WorkMode = "onsite" | "remote" | "hybrid";

export interface Job {
  id: number;
  user_id: number;

  title: string;
  company: string;
  location: string;

  job_type: JobType;
  work_mode: WorkMode;

  salary_min: number | null;
  salary_max: number | null;

  description: string;
  requirements: string;

  application_url: string | null;

  image: string | null;

  image_public_id: string | null;

  status: string;

  created_at: string;
  updated_at: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  location: string;
  job_type: JobType;
  work_mode: WorkMode;
  salary_min: string;
  salary_max: string;
  description: string;
  requirements: string;
  application_url: string;
  image: File | null;
}

export interface CreateJobResponse {
  message: string;
  job: Job;
}

export interface MyJobsResponse {
  jobs: Job[];
}

export interface SingleJobResponse {
  job: Job;
}

export interface UpdateJobResponse {
  message: string;
  job: Job;
}

export interface UpdateJobArgs {
  id: number;
  data: CreateJobData;
}

export interface DeleteJobResponse {
  message: string;
}
