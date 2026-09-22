import { Link } from 'react-router'
import { useFormik } from 'formik'

import Input from '../../components/common/Input'
import { registerSchema } from '../../schemas/authSchema'

interface RegisterFormValues {
  name: string
  email: string
  password: string
  password_confirmation: string
}

function RegisterPage() {
  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },

    validationSchema: registerSchema,

    onSubmit: (values, { setSubmitting }) => {
      console.log('Registration form:', values)

      setSubmitting(false)
    },
  })

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-md">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>

          <p className="mt-2 text-gray-600">
            Register to post and manage job opportunities.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="space-y-5">

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
                formik.touched.name
                  ? formik.errors.name
                  : undefined
              }
            />

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
                formik.touched.email
                  ? formik.errors.email
                  : undefined
              }
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password
                  ? formik.errors.password
                  : undefined
              }
            />

            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              label="Confirm Password"
              placeholder="Enter your password again"
              autoComplete="new-password"
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password_confirmation
                  ? formik.errors.password_confirmation
                  : undefined
              }
            />

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formik.isSubmitting
                ? 'Creating account...'
                : 'Create Account'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}

            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </p>

        </div>

      </div>

    </section>
  )
}

export default RegisterPage