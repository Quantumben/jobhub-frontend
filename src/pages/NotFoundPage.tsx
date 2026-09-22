import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-lg font-semibold text-blue-600">404</p>

        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="mt-4 text-gray-600">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
