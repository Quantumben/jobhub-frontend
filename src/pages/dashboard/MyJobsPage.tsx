import { useEffect, useState } from "react";

import { AlertCircle, BriefcaseBusiness, PlusCircle } from "lucide-react";

import { Link } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import MyJobCard from "../../components/jobs/MyJobCard";

import { fetchMyJobs, deleteJob } from "../../features/jobs/jobsSlice";

import DeleteJobModal from "../../components/jobs/DeleteJobModal";

import type { Job } from "../../features/jobs/jobTypes";
import { addToast } from "../../features/toasts/toastSlice";

function MyJobsPage() {
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const dispatch = useAppDispatch();

  const { myJobs, isLoadingMyJobs, isDeleting, error } = useAppSelector(
    (state) => state.jobs,
  );

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setJobToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) {
      return;
    }

    try {
      await dispatch(deleteJob(jobToDelete.id)).unwrap();

      setJobToDelete(null);

      dispatch(
        addToast({
          type: "success",
          message: "Job deleted successfully.",
        }),
      );
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Unable to delete the job.",
        }),
      );
    }
  };

  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);

  return (
    <div>
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>

          <p className="mt-2 text-gray-600">Manage all jobs you have posted.</p>
        </div>

        <Link
          to="/dashboard/jobs/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          Post New Job
        </Link>
      </div>

      {/* Loading */}

      {isLoadingMyJobs && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-gray-500">Loading your jobs...</p>
        </div>
      )}

      {/* Error */}

      {!isLoadingMyJobs && error && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

            <div>
              <p className="font-medium text-red-700">Unable to load jobs</p>

              <p className="mt-1 text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => dispatch(fetchMyJobs())}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}

      {!isLoadingMyJobs && !error && myJobs.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <BriefcaseBusiness className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            You haven't posted any jobs yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Create your first job listing and start connecting with candidates.
          </p>

          <Link
            to="/dashboard/jobs/create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5" />
            Post Your First Job
          </Link>
        </div>
      )}

      {/* Jobs */}

      {!isLoadingMyJobs && !error && myJobs.length > 0 && (
        <div className="mt-8 space-y-5">
          {myJobs.map((job) => (
            <MyJobCard key={job.id} job={job} onDelete={handleDeleteClick} />
          ))}
        </div>
      )}

      {jobToDelete && (
        <DeleteJobModal
          jobTitle={jobToDelete.title}
          isDeleting={isDeleting}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default MyJobsPage;
