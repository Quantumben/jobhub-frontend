import { BriefcaseBusiness, Eye, Laptop, MapPin, Pencil } from "lucide-react";

import { Link } from "react-router";

import type { Job } from "../../features/jobs/jobTypes";

interface MyJobCardProps {
  job: Job;
}

function MyJobCard({ job }: MyJobCardProps) {
  const jobType = job.job_type.replace("_", " ");

  const workMode = job.work_mode.replace("_", " ");

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}

        <div className="h-48 bg-gray-100 sm:h-auto sm:w-52">
          {job.image ? (
            <img
              src={job.image}
              alt={job.company}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-gray-400">
              <BriefcaseBusiness className="h-12 w-12" />
            </div>
          )}
        </div>

        {/* Content */}

        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold capitalize text-green-700">
                  {job.status}
                </span>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold capitalize text-blue-700">
                  {jobType}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-bold text-gray-900">
                {job.title}
              </h2>

              <p className="mt-1 font-medium text-gray-600">{job.company}</p>
            </div>

            <Link
              to={`/jobs/${job.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" />
              View
            </Link>

            <Link
              to={`/dashboard/jobs/${job.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />

              <span>{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Laptop className="h-4 w-4" />

              <span className="capitalize">{workMode}</span>
            </div>
          </div>

          {(job.salary_min || job.salary_max) && (
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-500">Salary</p>

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
        </div>
      </div>
    </article>
  );
}

export default MyJobCard;
