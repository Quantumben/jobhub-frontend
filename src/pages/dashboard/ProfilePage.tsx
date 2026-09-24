// import { useState } from "react";

import { CheckCircle2, UserRound } from "lucide-react";

import { isAxiosError } from "axios";

import { useFormik } from "formik";

import Input from "../../components/common/Input";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import { setCredentials } from "../../features/auth/authSlice";

import { authService } from "../../features/auth/authService";

import type {
  LaravelValidationResponse,
  UpdateProfileData,
} from "../../features/auth/authTypes";

import { profileSchema } from "../../schemas/authSchema";
import ChangePasswordForm from "../../components/profile/ChangePasswordForm";
import { addToast } from "../../features/toasts/toastSlice";

function ProfilePage() {
  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  /*
  |--------------------------------------------------------------------------
  | Success Message
  |--------------------------------------------------------------------------
  */

  //   const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Formik
  |--------------------------------------------------------------------------
  */

  const formik = useFormik<UpdateProfileData>({
    /*
      |--------------------------------------------------------------------------
      | Initial Values
      |--------------------------------------------------------------------------
      |
      | Our user has already been restored by AuthInitializer before
      | Dashboard pages become available.
      |
      */

    initialValues: {
      name: user?.name ?? "",

      email: user?.email ?? "",
    },

    /*
      |--------------------------------------------------------------------------
      | Important
      |--------------------------------------------------------------------------
      |
      | If Redux receives a different user later, update the form.
      |
      */

    enableReinitialize: true,

    validationSchema: profileSchema,

    /*
      |--------------------------------------------------------------------------
      | Submit
      |--------------------------------------------------------------------------
      */

    onSubmit: async (
      values,
      { setSubmitting, setFieldError, setStatus, resetForm },
    ) => {
      try {
        /*
          |--------------------------------------------------------------------------
          | Clear Previous Messages
          |--------------------------------------------------------------------------
          */

        setStatus(undefined);

        setSuccessMessage(null);

        /*
          |--------------------------------------------------------------------------
          | Call Laravel
          |--------------------------------------------------------------------------
          */

        const response = await authService.updateProfile(values);

        /*
          |--------------------------------------------------------------------------
          | Update Redux User
          |--------------------------------------------------------------------------
          */

        dispatch(setCredentials(response.user));

        dispatch(
          addToast({
            type: "success",
            message: response.message,
          }),
        );

        /*
          |--------------------------------------------------------------------------
          | Update Formik's Initial State
          |--------------------------------------------------------------------------
          |
          | This is useful because the Save button / dirty state should now
          | treat these updated values as the new starting values.
          |
          */

        resetForm({
          values: {
            name: response.user.name,

            email: response.user.email,
          },
        });

        /*
          |--------------------------------------------------------------------------
          | Success Message
          |--------------------------------------------------------------------------
          */

        setSuccessMessage(response.message);
      } catch (error) {
        /*
          |--------------------------------------------------------------------------
          | Laravel 422 Validation
          |--------------------------------------------------------------------------
          */

        if (
          isAxiosError<LaravelValidationResponse>(error) &&
          error.response?.status === 422
        ) {
          const validationErrors = error.response.data.errors;

          Object.entries(validationErrors).forEach(([field, messages]) => {
            setFieldError(field, messages[0]);
          });

          return;
        }

        /*
          |--------------------------------------------------------------------------
          | General Error
          |--------------------------------------------------------------------------
          */

        setStatus("Unable to update your profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  /*
  |--------------------------------------------------------------------------
  | User Should Exist
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Unable to load your profile.</p>
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
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        <p className="mt-2 text-gray-600">Manage your account information.</p>
      </div>

      {/* Profile Card */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Profile Header */}

        <div className="border-b border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <UserRound className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>

              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Form */}

        <div className="p-6 sm:p-8">
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="max-w-2xl space-y-6"
          >
            {/* Success */}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

                <p>{successMessage}</p>
              </div>
            )}

            {/* General Error */}

            {formik.status && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formik.status}
              </div>
            )}

            {/* Name */}

            <Input
              id="name"
              name="name"
              type="text"
              label="Full Name"
              placeholder="John Donald"
              autoComplete="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.name || formik.submitCount > 0
                  ? formik.errors.name
                  : undefined
              }
            />

            {/* Email */}

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              placeholder="john@example.com"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.email || formik.submitCount > 0
                  ? formik.errors.email
                  : undefined
              }
            />

            {/* Actions */}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Update your name or email address.
              </p>

              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.dirty}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formik.isSubmitting ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security */}

      <div className="mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}

export default ProfilePage;
