import { useEffect, useState, type ChangeEvent } from "react";

import { isAxiosError } from "axios";

import { useFormik } from "formik";

import { useNavigate } from "react-router";

import Input from "../../components/common/Input";

import { useAppDispatch } from "../../app/hooks";

import { companiesService } from "../../features/companies/companiesService";

import { addMyCompany } from "../../features/companies/companiesSlice";

import { addToast } from "../../features/toasts/toastSlice";

import type { CompanyFormData } from "../../features/companies/companyTypes";

import type { LaravelValidationResponse } from "../../features/auth/authTypes";

import { companySchema } from "../../schemas/companySchema";

function CreateCompanyPage() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const formik = useFormik<CompanyFormData>({
    initialValues: {
      name: "",

      website: "",

      location: "",

      description: "",

      logo: null,
    },

    validationSchema: companySchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        /*
          |--------------------------------------------------------------------------
          | File stays outside Redux
          |--------------------------------------------------------------------------
          */

        const response = await companiesService.createCompany(values);

        /*
          |--------------------------------------------------------------------------
          | Redux receives only normal JSON
          |--------------------------------------------------------------------------
          */

        dispatch(addMyCompany(response.company));

        dispatch(
          addToast({
            type: "success",
            message: response.message,
          }),
        );

        navigate("/dashboard/companies");
      } catch (error) {
        if (
          isAxiosError<LaravelValidationResponse>(error) &&
          error.response?.status === 422
        ) {
          Object.entries(error.response.data.errors).forEach(
            ([field, messages]) => {
              setFieldError(field, messages[0]);
            },
          );

          return;
        }

        dispatch(
          addToast({
            type: "error",
            message: "Unable to create company.",
          }),
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Logo
  |--------------------------------------------------------------------------
  */

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      formik.setFieldValue("logo", null);

      setLogoPreview(null);

      return;
    }

    formik.setFieldValue("logo", file);

    setLogoPreview(URL.createObjectURL(file));
  };

  /*
  |--------------------------------------------------------------------------
  | Preview Cleanup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const fieldError = (field: keyof CompanyFormData) => {
    if (formik.touched[field] || formik.submitCount > 0) {
      return formik.errors[field];
    }

    return undefined;
  };

  return (
    <div>
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Company</h1>

        <p className="mt-2 text-gray-600">
          Add the company information that will be associated with your job
          listings.
        </p>
      </div>

      {/* Form */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <form
          onSubmit={formik.handleSubmit}
          noValidate
          className="max-w-3xl space-y-6"
        >
          {/* Name */}

          <Input
            id="name"
            name="name"
            type="text"
            label="Company Name"
            placeholder="Acme Technologies"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("name")}
          />

          {/* Website */}

          <Input
            id="website"
            name="website"
            type="url"
            label="Website"
            placeholder="https://example.com"
            value={formik.values.website}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={fieldError("website")}
          />

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

          {/* Description */}

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={7}
              placeholder="Tell job seekers about the company..."
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

          {/* Logo */}

          <div>
            <label
              htmlFor="logo"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Company Logo
            </label>

            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleLogoChange}
              onBlur={() => formik.setFieldTouched("logo", true)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-600 hover:file:bg-blue-100"
            />

            {fieldError("logo") && (
              <p className="mt-1.5 text-sm text-red-600">
                {fieldError("logo")}
              </p>
            )}

            {/* Preview */}

            {logoPreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">
                  Logo Preview
                </p>

                <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={logoPreview}
                    alt="Company logo preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={formik.isSubmitting}
              onClick={() => navigate("/dashboard/companies")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? "Creating Company..." : "Create Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCompanyPage;
