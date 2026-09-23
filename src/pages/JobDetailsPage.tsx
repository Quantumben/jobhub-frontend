import { useEffect, useState } from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  Laptop,
  MapPin,
  Share2,
} from "lucide-react";

import { Link, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import { fetchPublicJob } from "../features/jobs/jobsSlice";

function JobDetailsPage() {
  /*
  |--------------------------------------------------------------------------
  | Route Parameter
  |--------------------------------------------------------------------------
  */

  const { id } = useParams();

  const jobId = Number(id);

  const hasValidJobId = Number.isInteger(jobId) && jobId > 0;

  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch = useAppDispatch();

  const { publicSelectedJob, isLoadingPublicJob, publicJobError } =
    useAppSelector((state) => state.jobs);

  /*
  |--------------------------------------------------------------------------
  | Share Status
  |--------------------------------------------------------------------------
  */

  const [shareMessage, setShareMessage] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Job
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!hasValidJobId) {
      return;
    }

    dispatch(fetchPublicJob(jobId));
  }, [dispatch, jobId, hasValidJobId]);

  /*
  |--------------------------------------------------------------------------
  | Share Job
  |--------------------------------------------------------------------------
  */

  const handleShare = async () => {
    if (!publicSelectedJob) {
      return;
    }

    const shareData = {
      title: publicSelectedJob.title,

      text: `${publicSelectedJob.title} at ${publicSelectedJob.company}`,

      url: window.location.href,
    };

    try {
      /*
        |--------------------------------------------------------------------------
        | Native Web Share
        |--------------------------------------------------------------------------
        */

      if (typeof navigator.share === "function") {
        await navigator.share(shareData);

        setShareMessage("Job shared.");

        return;
      }

      /*
        |--------------------------------------------------------------------------
        | Clipboard Fallback
        |--------------------------------------------------------------------------
        */

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);

        setShareMessage("Job link copied.");

        return;
      }

      /*
        |--------------------------------------------------------------------------
        | Final Fallback
        |--------------------------------------------------------------------------
        */

      window.prompt("Copy this job link:", window.location.href);
    } catch (error) {
      /*
        |--------------------------------------------------------------------------
        | User cancelling native share is not really an application error.
        |--------------------------------------------------------------------------
        */

      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setShareMessage("Unable to share this job.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Invalid URL ID
  |--------------------------------------------------------------------------
  */

  if (!hasValidJobId) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700">Invalid job</h1>

          <p className="mt-2 text-red-600">
            The job ID in this URL is invalid.
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white"
          >
            Browse Jobs
          </Link>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoadingPublicJob) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-500">Loading job...</p>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error / Not Found
  |--------------------------------------------------------------------------
  */

  if (publicJobError && !publicSelectedJob) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700">Job unavailable</h1>

          <p className="mt-2 text-red-600">{publicJobError}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(fetchPublicJob(jobId))}
              className="rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Try Again
            </button>

            <Link
              to="/jobs"
              className="rounded-lg border border-red-200 bg-white px-5 py-3 text-sm font-medium text-red-700"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Job
  |--------------------------------------------------------------------------
  */

  if (!publicSelectedJob || publicSelectedJob.id !== jobId) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Useful Display Values
  |--------------------------------------------------------------------------
  */

  const job = publicSelectedJob;

  const jobType = job.job_type.replace("_", " ");

  const workMode = job.work_mode.replace("_", " ");

  const postedDate = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(job.created_at));

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back */}

      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      {/* Main Grid */}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main Content */}

        <main className="min-w-0">
          {/* Hero */}

          <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Image */}

            <div className="h-64 bg-gray-100 sm:h-80">
              {job.image ? (
                <img
                  src={job.image}
                  alt={job.company}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-300">
                  <BriefcaseBusiness className="h-20 w-20" />
                </div>
              )}
            </div>

            {/* Main Header */}

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                  {jobType}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                  {workMode}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {job.title}
              </h1>

              <p className="mt-2 text-lg font-medium text-gray-600">
                {job.company}
              </p>

              {/* Meta */}

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />

                  <span>{job.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />

                  <span className="capitalize">{workMode}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />

                  <span>Posted {postedDate}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Description */}

          <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Job Description
            </h2>

            <p className="mt-5 whitespace-pre-line leading-7 text-gray-600">
              {job.description}
            </p>
          </article>

          {/* Requirements */}

          <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900">Requirements</h2>

            <p className="mt-5 whitespace-pre-line leading-7 text-gray-600">
              {job.requirements}
            </p>
          </article>
        </main>

        {/* Sidebar */}

        <aside>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-gray-900">Job Overview</h2>

            {/* Salary */}

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500">Salary</p>

              <p className="mt-1 font-semibold text-gray-900">
                {job.salary_min || job.salary_max ? (
                  <>
                    {job.salary_min
                      ? new Intl.NumberFormat().format(job.salary_min)
                      : "Not specified"}

                    {" — "}

                    {job.salary_max
                      ? new Intl.NumberFormat().format(job.salary_max)
                      : "Not specified"}
                  </>
                ) : (
                  "Not specified"
                )}
              </p>
            </div>

            {/* Location */}

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-500">Location</p>

              <p className="mt-1 font-semibold text-gray-900">{job.location}</p>
            </div>

            {/* Type */}

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-500">Job Type</p>

              <p className="mt-1 capitalize font-semibold text-gray-900">
                {jobType}
              </p>
            </div>

            {/* Work Mode */}

            <div className="mt-5 border-t border-gray-100 pt-5">
              <p className="text-sm font-medium text-gray-500">Work Mode</p>

              <p className="mt-1 capitalize font-semibold text-gray-900">
                {workMode}
              </p>
            </div>

            {/* Apply */}

            {job.application_url ? (
              <a
                href={job.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Apply for this Job
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <div className="mt-7 rounded-lg bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
                No external application link was provided.
              </div>
            )}

            {/* Share */}

            <button
              type="button"
              onClick={handleShare}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4" />
              Share Job
            </button>

            {shareMessage && (
              <p className="mt-3 text-center text-sm text-gray-500">
                {shareMessage}
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default JobDetailsPage;
