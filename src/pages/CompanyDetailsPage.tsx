import { useEffect } from "react";

import { ArrowLeft, Building2, ExternalLink, MapPin } from "lucide-react";

import { Link, useParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import PublicJobCard from "../components/jobs/PublicJobCard";

import { fetchCompany } from "../features/companies/companiesSlice";

function CompanyDetailsPage() {
  const { id } = useParams();

  const companyId = Number(id);

  const hasValidId = Number.isInteger(companyId) && companyId > 0;

  const dispatch = useAppDispatch();

  const { selectedCompany, isLoadingCompany, companyError } = useAppSelector(
    (state) => state.companies,
  );

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!hasValidId) {
      return;
    }

    dispatch(fetchCompany(companyId));
  }, [dispatch, companyId, hasValidId]);

  /*
  |--------------------------------------------------------------------------
  | Invalid URL
  |--------------------------------------------------------------------------
  */

  if (!hasValidId) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700">Invalid company</h1>

          <Link
            to="/companies"
            className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 text-white"
          >
            Browse Companies
          </Link>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (isLoadingCompany) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-gray-500">Loading company...</p>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (companyError && !selectedCompany) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700">
            Company unavailable
          </h1>

          <p className="mt-2 text-red-600">{companyError}</p>

          <Link
            to="/companies"
            className="mt-6 inline-flex rounded-lg bg-red-600 px-5 py-3 font-medium text-white"
          >
            Browse Companies
          </Link>
        </div>
      </section>
    );
  }

  if (!selectedCompany || selectedCompany.id !== companyId) {
    return null;
  }

  const company = selectedCompany;

  const jobs = company.jobs ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back */}

      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Companies
      </Link>

      {/* Company Hero */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          {/* Logo */}

          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-14 w-14 text-gray-300" />
            )}
          </div>

          {/* Company */}

          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {company.name}
            </h1>

            {company.location && (
              <div className="mt-3 flex items-center gap-2 text-gray-500">
                <MapPin className="h-5 w-5" />

                <span>{company.location}</span>
              </div>
            )}

            <p className="mt-3 text-sm font-medium text-blue-600">
              {company.active_jobs_count}{" "}
              {company.active_jobs_count === 1
                ? "open position"
                : "open positions"}
            </p>
          </div>

          {/* Website */}

          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Visit Website
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* About */}

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900">
          About {company.name}
        </h2>

        {company.description ? (
          <p className="mt-5 whitespace-pre-line leading-7 text-gray-600">
            {company.description}
          </p>
        ) : (
          <p className="mt-5 text-gray-500">
            No company description has been provided.
          </p>
        )}
      </div>

      {/* Jobs */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Open Jobs</h2>

        <p className="mt-2 text-gray-500">
          Current opportunities at {company.name}.
        </p>

        {jobs.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-500">
              This company currently has no open jobs.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <PublicJobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CompanyDetailsPage;
