import { BriefcaseBusiness, Laptop, MapPin } from "lucide-react";

import { Link } from "react-router";

import type { Job } from "../../features/jobs/jobTypes";

interface PublicJobCardProps {
  job: Job;
}

function PublicJobCard({ job }: PublicJobCardProps) {
  const jobType = job.job_type.replace("_", " ");

  const workMode = job.work_mode.replace("_", " ");

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Image */}

      <div className="h-48 bg-gray-100">
        {job.image ? (
          <img
            src={job.image}
            alt={job.company}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <BriefcaseBusiness className="h-14 w-14" />
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
            {jobType}
          </span>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-600">
            {workMode}
          </span>
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900">{job.title}</h2>

        <p className="mt-1 font-medium text-gray-600">{job.company}</p>

        <div className="mt-5 space-y-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />

            <span>{job.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4 shrink-0" />

            <span className="capitalize">{workMode}</span>
          </div>
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Salary
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {job.salary_min
                ? new Intl.NumberFormat().format(job.salary_min)
                : "Not specified"}

              {" — "}

              {job.salary_max
                ? new Intl.NumberFormat().format(job.salary_max)
                : "Not specified"}
            </p>
          </div>
        )}

        <Link
          to={`/jobs/${job.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Job
        </Link>
      </div>
    </article>
  );
}

export default PublicJobCard;
