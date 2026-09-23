import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";

import Input from "../../components/common/Input";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { createJob } from "../../features/jobs/jobsSlice";

import type { CreateJobData } from "../../features/jobs/jobTypes";

import type { LaravelValidationResponse } from "../../features/auth/authTypes";

import { jobSchema } from "../../schemas/jobSchema";

function CreateJobPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const isCreating = useAppSelector((state) => state.jobs.isCreating);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      formik.setFieldValue("image", null);

      setImagePreview(null);

      return;
    }

    formik.setFieldValue("image", file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const formik = useFormik<CreateJobData>({
    initialValues: {
      title: "",
      company: "",
      location: "",

      job_type: "full_time",
      work_mode: "onsite",

      salary_min: "",
      salary_max: "",

      description: "",
      requirements: "",

      application_url: "",

      image: null,
    },

    validationSchema: jobSchema,

    onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
      try {
        setStatus(undefined);

        await dispatch(createJob(values)).unwrap();

        navigate("/dashboard/jobs");
      } catch (error) {
        if (typeof error === "object" && error !== null && "errors" in error) {
          const validationError = error as LaravelValidationResponse;

          Object.entries(validationError.errors).forEach(
            ([field, messages]) => {
              setFieldError(field, messages[0]);
            },
          );
        } else {
          setStatus("Unable to create the job. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });


  const fieldError = (field: keyof CreateJobData) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field];
    }

    return undefined;
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>

        <p className="mt-2 text-gray-600">
          Create a new opportunity for job seekers.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
          {formik.status && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formik.status}
            </div>
          )}

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

          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Company / Job Image
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

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Preview
                </p>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Selected job preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

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

          <div className="grid gap-5 sm:grid-cols-2">
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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {fieldError("description") && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("description")}
              </p>
            )}
          </div>

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
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {fieldError("requirements") && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("requirements")}
              </p>
            )}
          </div>

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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={formik.isSubmitting || isCreating}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Creating Job..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
