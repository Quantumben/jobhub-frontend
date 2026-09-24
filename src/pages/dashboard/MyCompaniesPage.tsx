import { useEffect } from "react";

import { Building2, PlusCircle } from "lucide-react";

import { Link } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import MyCompanyCard from "../../components/companies/MyCompanyCard";

import { fetchMyCompanies } from "../../features/companies/companiesSlice";

function MyCompaniesPage() {
  const dispatch = useAppDispatch();

  const { myCompanies, isLoadingMyCompanies, myCompaniesError } =
    useAppSelector((state) => state.companies);

  useEffect(() => {
    dispatch(fetchMyCompanies());
  }, [dispatch]);

  return (
    <div>
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Companies</h1>

          <p className="mt-2 text-gray-600">
            Manage the companies you use when posting jobs.
          </p>
        </div>

        <Link
          to="/dashboard/companies/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          Create Company
        </Link>
      </div>

      {/* Loading */}

      {isLoadingMyCompanies && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-500">Loading your companies...</p>
        </div>
      )}

      {/* Error */}

      {!isLoadingMyCompanies && myCompaniesError && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-medium">Unable to load companies</p>

          <p className="mt-1 text-sm">{myCompaniesError}</p>

          <button
            type="button"
            onClick={() => dispatch(fetchMyCompanies())}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}

      {!isLoadingMyCompanies &&
        !myCompaniesError &&
        myCompanies.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Building2 className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              You haven't created a company yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Create a company profile before connecting your job listings to a
              company.
            </p>

            <Link
              to="/dashboard/companies/create"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white"
            >
              <PlusCircle className="h-5 w-5" />
              Create Your First Company
            </Link>
          </div>
        )}

      {/* Companies */}

      {!isLoadingMyCompanies && !myCompaniesError && myCompanies.length > 0 && (
        <div className="mt-8 space-y-5">
          {myCompanies.map((company) => (
            <MyCompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCompaniesPage;
