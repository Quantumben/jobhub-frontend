import { BriefcaseBusiness, Eye, PlusCircle } from "lucide-react";

import { Link } from "react-router";

import { useAppSelector } from "../../app/hooks";

function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Dashboard</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your job listings and profile from here.
          </p>
        </div>

        <Link
          to="/dashboard/jobs/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          Post a Job
        </Link>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">Total Jobs</p>

          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Eye className="h-6 w-6" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">Job Views</p>

          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>

          <p className="mt-5 text-sm font-medium text-gray-500">Active Jobs</p>

          <p className="mt-1 text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
