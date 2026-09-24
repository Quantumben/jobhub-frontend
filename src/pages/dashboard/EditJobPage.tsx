import { useEffect, useState, type ChangeEvent } from "react";

import { useFormik } from "formik";

import { useNavigate, useParams } from "react-router";

import Input from "../../components/common/Input";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { fetchMyJob, updateJob } from "../../features/jobs/jobsSlice";

import type { CreateJobData } from "../../features/jobs/jobTypes";

import type { LaravelValidationResponse } from "../../features/auth/authTypes";

import { jobSchema } from "../../schemas/jobSchema";
import { addToast } from "../../features/toasts/toastSlice";

function EditJobPage() {
  /*
  |--------------------------------------------------------------------------
  | React Router
  |--------------------------------------------------------------------------
  */

  const { id } = useParams();

  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | Convert Route ID
  |--------------------------------------------------------------------------
  |
  | useParams gives us a string.
  |
  | Example:
  |
  | /dashboard/jobs/15/edit
  |
  | id = "15"
  |
  | We convert it to:
  |
  | 15
  |
  */

  const jobId = Number(id);

  const hasValidJobId = Number.isInteger(jobId) && jobId > 0;

  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch = useAppDispatch();

  const { selectedJob, isLoadingJob, isUpdating, error } = useAppSelector(
    (state) => state.jobs,
  );

  /*
  |--------------------------------------------------------------------------
  | New Image Preview
  |--------------------------------------------------------------------------
  |
  | This is only for a newly selected local file.
  |
  | The existing image still comes from Cloudinary.
  |
  */

  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Existing Job
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!hasValidJobId) {
      return;
    }

    dispatch(fetchMyJob(jobId));
  }, [dispatch, jobId, hasValidJobId]);

  /*
  |--------------------------------------------------------------------------
  | Formik
  |--------------------------------------------------------------------------
  */

  const formik = useFormik<CreateJobData>({
    /*
      |--------------------------------------------------------------------------
      | enableReinitialize
      |--------------------------------------------------------------------------
      |
      | selectedJob is initially null.
      |
      | Laravel then returns the job.
      |
      | This tells Formik to update the form's initial values when
      | selectedJob changes.
      |
      */

    enableReinitialize: true,

    initialValues: {
      title: selectedJob?.title ?? "",

      company: selectedJob?.company ?? "",

      location: selectedJob?.location ?? "",

      job_type: selectedJob?.job_type ?? "full_time",

      work_mode: selectedJob?.work_mode ?? "onsite",

      salary_min: selectedJob?.salary_min?.toString() ?? "",

      salary_max: selectedJob?.salary_max?.toString() ?? "",

      description: selectedJob?.description ?? "",

      requirements: selectedJob?.requirements ?? "",

      application_url: selectedJob?.application_url ?? "",

      /*
        |--------------------------------------------------------------------------
        | Important
        |--------------------------------------------------------------------------
        |
        | We do NOT put the existing Cloudinary image here.
        |
        | image expects:
        |
        | File | null
        |
        | The existing Cloudinary image is a URL string.
        |
        | So image stays null until the user selects a replacement.
        |
        */

      image: null,
    },

    validationSchema: jobSchema,

    /*
      |--------------------------------------------------------------------------
      | Submit Updated Job
      |--------------------------------------------------------------------------
      */

    onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
      if (!hasValidJobId) {
        setStatus("Invalid job ID.");

        setSubmitting(false);

        return;
      }

      try {
        /*
          |--------------------------------------------------------------------------
          | Clear Old General Error
          |--------------------------------------------------------------------------
          */

        setStatus(undefined);

        /*
          |--------------------------------------------------------------------------
          | Dispatch Redux Update
          |--------------------------------------------------------------------------
          */

        await dispatch(
          updateJob({
            id: jobId,
            data: values,
          }),
        ).unwrap();

        dispatch(
          addToast({
            type: "success",
            message: "Job updated successfully.",
          }),
        );

        /*
          |--------------------------------------------------------------------------
          | Success
          |--------------------------------------------------------------------------
          */

        navigate("/dashboard/jobs");
      } catch (error) {
        /*
          |--------------------------------------------------------------------------
          | Laravel Validation Errors
          |--------------------------------------------------------------------------
          |
          | Example:
          |
          | {
          |   errors: {
          |     salary_max: [
          |       "Salary max must be greater..."
          |     ]
          |   }
          | }
          |
          */

        if (typeof error === "object" && error !== null && "errors" in error) {
          const validationError = error as LaravelValidationResponse;

          Object.entries(validationError.errors).forEach(
            ([field, messages]) => {
              setFieldError(field, messages[0]);
            },
          );
        } else {
          /*
            |--------------------------------------------------------------------------
            | General Error
            |--------------------------------------------------------------------------
            */

          setStatus("Unable to update the job. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Image Selection
  |--------------------------------------------------------------------------
  */

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    /*
    |--------------------------------------------------------------------------
    | No File
    |--------------------------------------------------------------------------
    */

    if (!file) {
      formik.setFieldValue("image", null);

      setNewImagePreview(null);

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Put File Into Formik
    |--------------------------------------------------------------------------
    */

    formik.setFieldValue("image", file);

    /*
    |--------------------------------------------------------------------------
    | Create Local Preview
    |--------------------------------------------------------------------------
    */

    const previewUrl = URL.createObjectURL(file);

    setNewImagePreview(previewUrl);
  };

  /*
  |--------------------------------------------------------------------------
  | Clean Local Image Preview
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
    };
  }, [newImagePreview]);

  /*
  |--------------------------------------------------------------------------
  | Which Image Should Be Displayed?
  |--------------------------------------------------------------------------
  |
  | Priority:
  |
  | 1. Newly selected local image
  | 2. Existing Cloudinary image
  | 3. No image
  |
  */

  const imagePreview = newImagePreview ?? selectedJob?.image ?? null;

  /*
  |--------------------------------------------------------------------------
  | Reusable Field Error Function
  |--------------------------------------------------------------------------
  */

  const fieldError = (field: keyof CreateJobData) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field];
    }

    return undefined;
  };

  /*
  |--------------------------------------------------------------------------
  | Invalid Job ID
  |--------------------------------------------------------------------------
  */

  if (!hasValidJobId) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-lg font-semibold text-red-700">Invalid Job</h1>

        <p className="mt-2 text-sm text-red-600">
          The job ID in the URL is invalid.
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard/jobs")}
          className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Back to My Jobs
        </button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoadingJob) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="mt-4 text-gray-500">Loading job...</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Job Could Not Be Loaded
  |--------------------------------------------------------------------------
  */

  if (error && !selectedJob) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h1 className="font-semibold text-red-700">Unable to load this job</h1>

        <p className="mt-2 text-sm text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => dispatch(fetchMyJob(jobId))}
          className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No Job
  |--------------------------------------------------------------------------
  */

  if (!selectedJob || selectedJob.id !== jobId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Job not found.</p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      {/* Page Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>

        <p className="mt-2 text-gray-600">
          Update your job listing information.
        </p>
      </div>

      {/* Form Container */}

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
          {/* General Error */}

          {formik.status && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formik.status}
            </div>
          )}

          {/* Job Title */}

          <Input
            id="title"
            name="title"
            type="text"
            label="Job Title"
            placeholder="Frontend Developer"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("title")}
          />

          {/* Company */}

          <Input
            id="company"
            name="company"
            type="text"
            label="Company"
            placeholder="Acme Technologies"
            value={formik.values.company}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("company")}
          />

          {/* Image */}

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Replace Company / Job Image
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              onBlur={() => formik.setFieldTouched("image", true)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-600 hover:file:bg-blue-100"
            />

            {fieldError("image") && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("image")}
              </p>
            )}

            {/* Image Preview */}

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Current Preview
                </p>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Job preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location */}

          <Input
            id="location"
            name="location"
            type="text"
            label="Location"
            placeholder="London, United Kingdom"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("location")}
          />

          {/* Job Type + Work Mode */}

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Job Type */}

            <div>
              <label
                htmlFor="job_type"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Job Type
              </label>

              <select
                id="job_type"
                name="job_type"
                value={formik.values.job_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                  fieldError("job_type")
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="full_time">Full Time</option>

                <option value="part_time">Part Time</option>

                <option value="contract">Contract</option>

                <option value="internship">Internship</option>
              </select>

              {fieldError("job_type") && (
                <p className="mt-1.5 text-sm text-red-600">
                  {fieldError("job_type")}
                </p>
              )}
            </div>

            {/* Work Mode */}

            <div>
              <label
                htmlFor="work_mode"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Work Mode
              </label>

              <select
                id="work_mode"
                name="work_mode"
                value={formik.values.work_mode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-gray-900 outline-none transition focus:ring-2 ${
                  fieldError("work_mode")
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                }`}
              >
                <option value="onsite">On-site</option>

                <option value="remote">Remote</option>

                <option value="hybrid">Hybrid</option>
              </select>

              {fieldError("work_mode") && (
                <p className="mt-1.5 text-sm text-red-600">
                  {fieldError("work_mode")}
                </p>
              )}
            </div>
          </div>

          {/* Salary */}

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="salary_min"
              name="salary_min"
              type="number"
              min="0"
              step="0.01"
              label="Minimum Salary"
              placeholder="50000"
              value={formik.values.salary_min}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("salary_min")}
            />

            <Input
              id="salary_max"
              name="salary_max"
              type="number"
              min="0"
              step="0.01"
              label="Maximum Salary"
              placeholder="70000"
              value={formik.values.salary_max}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={fieldError("salary_max")}
            />
          </div>

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Job Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={7}
              placeholder="Describe the position, responsibilities and what the successful candidate will do..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full resize-y rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                fieldError("description")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {fieldError("description") && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("description")}
              </p>
            )}
          </div>

          {/* Requirements */}

          <div>
            <label
              htmlFor="requirements"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Requirements
            </label>

            <textarea
              id="requirements"
              name="requirements"
              rows={6}
              placeholder="React, TypeScript, Git, communication skills..."
              value={formik.values.requirements}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full resize-y rounded-lg border px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                fieldError("requirements")
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {fieldError("requirements") && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("requirements")}
              </p>
            )}
          </div>

          {/* Application URL */}

          <Input
            id="application_url"
            name="application_url"
            type="url"
            label="Application URL"
            placeholder="https://company.com/jobs/apply"
            value={formik.values.application_url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("application_url")}
          />

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => navigate("/dashboard/jobs")}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting || isUpdating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? "Updating Job..." : "Update Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJobPage;
