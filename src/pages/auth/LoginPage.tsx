import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { Link, useNavigate, useLocation } from "react-router";

import Input from "../../components/common/Input";

import { useAppDispatch } from "../../app/hooks";

import { setCredentials } from "../../features/auth/authSlice";

import { authService } from "../../features/auth/authService";

import type {
  LaravelValidationResponse,
  LoginData,
} from "../../features/auth/authTypes";

import { loginSchema } from "../../schemas/authSchema";
import { addToast } from "../../features/toasts/toastSlice";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const from =
    (
      location.state as {
        from?: string;
      } | null
    )?.from ?? "/dashboard";

  const formik = useFormik<LoginData>({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema,

    onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
      try {
        setStatus(undefined);

        const response = await authService.login(values);

        localStorage.setItem("auth_token", response.token);

        dispatch(setCredentials(response.user));

        dispatch(
          addToast({
            type: "success",
            message: `Welcome back, ${response.user.name}.`,
          }),
        );
        navigate(from, {
          replace: true,
        });
      } catch (error) {
        if (
          isAxiosError<LaravelValidationResponse>(error) &&
          error.response?.status === 422
        ) {
          const errors = error.response.data.errors;

          Object.entries(errors).forEach(([field, messages]) => {
            setFieldError(field, messages[0]);
          });

          return;
        }

        setStatus("Unable to login. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

          <p className="mt-2 text-gray-600">
            Login to manage your jobs and profile.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">
            {formik.status && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formik.status}
              </div>
            )}

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

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password || formik.submitCount > 0
                  ? formik.errors.password
                  : undefined
              }
            />

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
