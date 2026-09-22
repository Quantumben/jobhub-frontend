import { Link } from "react-router";
import { Search, BriefcaseBusiness } from "lucide-react";

function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Your next opportunity starts here
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Find a job that matches your ambition.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Discover opportunities from companies looking for talented people like
          you.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            <Search className="h-5 w-5" />
            Find Jobs
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            Post a Job
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
