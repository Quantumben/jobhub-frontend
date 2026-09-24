import { useState } from "react";

import { CheckCircle2, KeyRound } from "lucide-react";

import { isAxiosError } from "axios";

import { useFormik } from "formik";

import Input from "../common/Input";

import { authService } from "../../features/auth/authService";

import type {
  ChangePasswordData,
  LaravelValidationResponse,
} from "../../features/auth/authTypes";

import { changePasswordSchema } from "../../schemas/authSchema";

import { useAppDispatch } from "../../app/hooks";
import { addToast } from "../../features/toasts/toastSlice";

function ChangePasswordForm() {
  const dispatch = useAppDispatch();

  /*
  |--------------------------------------------------------------------------
  | Success Message
  |--------------------------------------------------------------------------
  */

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | Formik
  |--------------------------------------------------------------------------
  */

  const formik = useFormik<ChangePasswordData>({
    initialValues: {
      current_password: "",

      password: "",

      password_confirmation: "",
    },

    validationSchema: changePasswordSchema,

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
          | Laravel Request
          |--------------------------------------------------------------------------
          */

        const response = await authService.changePassword(values);

        /*
          |--------------------------------------------------------------------------
          | Clear Password Fields
          |--------------------------------------------------------------------------
          |
          | Never leave the entered passwords sitting inside the form after
          | a successful password change.
          |
          */

        resetForm();

        dispatch(
          addToast({
            type: "success",
            message: response.message,
          }),
        );

        dispatch(
          addToast({
            type: "error",
            message: "Unable to change your password.",
          }),
        );
        /*
          |--------------------------------------------------------------------------
          | Success
          |--------------------------------------------------------------------------
          */

        setSuccessMessage(response.message);
      } catch (error) {
        /*
          |--------------------------------------------------------------------------
          | Laravel Validation Errors
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
          | General Failure
          |--------------------------------------------------------------------------
          */

        setStatus("Unable to change your password. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Header */}

      <div className="border-b border-gray-100 bg-gray-50 px-6 py-6 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <KeyRound className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">Security</h2>

            <p className="mt-1 text-sm text-gray-500">
              Change your account password.
            </p>
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

          {/* Current Password */}

          <Input
            id="current_password"
            name="current_password"
            type="password"
            label="Current Password"
            placeholder="Enter your current password"
            autoComplete="current-password"
            value={formik.values.current_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.current_password || formik.submitCount > 0
                ? formik.errors.current_password
                : undefined
            }
          />

          {/* New Password */}

          <Input
            id="password"
            name="password"
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password || formik.submitCount > 0
                ? formik.errors.password
                : undefined
            }
          />

          {/* Confirm */}

          <Input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            label="Confirm New Password"
            placeholder="Enter your new password again"
            autoComplete="new-password"
            value={formik.values.password_confirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.password_confirmation || formik.submitCount > 0
                ? formik.errors.password_confirmation
                : undefined
            }
          />

          {/* Password Hint */}

          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-500">
              Your new password must contain at least 8 characters.
            </p>
          </div>

          {/* Submit */}

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordForm;
