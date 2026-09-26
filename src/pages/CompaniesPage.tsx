import { useEffect, useState, useCallback } from "react";

import { Building2, MapPin, Search } from "lucide-react";

import { useSearchParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import CompanyCard from "../components/companies/CompanyCard";

import { fetchCompanies } from "../features/companies/companiesSlice";

function CompaniesPage() {
  const dispatch = useAppDispatch();

  const { companies, pagination, isLoadingCompanies, companiesError } =
    useAppSelector((state) => state.companies);

  /*
  |--------------------------------------------------------------------------
  | URL Filters
  |--------------------------------------------------------------------------
  */

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const location = searchParams.get("location") ?? "";

  const requestedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  /*
  |--------------------------------------------------------------------------
  | Input State
  |--------------------------------------------------------------------------
  */

  const [searchInput, setSearchInput] = useState(search);

  const [locationInput, setLocationInput] = useState(location);

  /*
  |--------------------------------------------------------------------------
  | Browser Back / Forward
  |--------------------------------------------------------------------------
  */

  useCallback(() => {
    setSearchInput(search);
    setLocationInput(location);
  }, [search, location]);

  /*
  |--------------------------------------------------------------------------
  | Debounce
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);

      if (searchInput.trim()) {
        next.set("search", searchInput.trim());
      } else {
        next.delete("search");
      }

      if (locationInput.trim()) {
        next.set("location", locationInput.trim());
      } else {
        next.delete("location");
      }

      next.delete("page");

      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, {
          replace: true,
        });
      }
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [searchInput, locationInput, searchParams, setSearchParams]);

  /*
  |--------------------------------------------------------------------------
  | Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      fetchCompanies({
        search,

        location,

        page,
      }),
    );
  }, [dispatch, search, location, page]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.last_page) {
      return;
    }

    const next = new URLSearchParams(searchParams);

    if (newPage === 1) {
      next.delete("page");
    } else {
      next.set("page", newPage.toString());
    }

    setSearchParams(next);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const clearFilters = () => {
    setSearchInput("");

    setLocationInput("");

    setSearchParams({});
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Heading */}

      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-blue-600">Employers</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Find Companies
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Discover companies and explore their current job opportunities.
        </p>
      </div>

      {/* Search */}

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="company-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Company
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                id="company-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search companies..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="company-location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                id="company-location"
                type="search"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                placeholder="London, Manchester..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Results */}

      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Companies</h2>

        {!isLoadingCompanies && (
          <p className="mt-1 text-sm text-gray-500">
            {pagination.total}{" "}
            {pagination.total === 1 ? "company" : "companies"}
          </p>
        )}
      </div>

      {/* Loading */}

      {isLoadingCompanies && (
        <div className="mt-8 text-center text-gray-500">
          Loading companies...
        </div>
      )}

      {/* Error */}

      {!isLoadingCompanies && companiesError && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {companiesError}
        </div>
      )}

      {/* Empty */}

      {!isLoadingCompanies && !companiesError && companies.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-300" />

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No companies found
          </h2>

          <p className="mt-2 text-gray-500">Try changing your search.</p>
        </div>
      )}

      {/* Company Cards */}

      {!isLoadingCompanies && !companiesError && companies.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          {/* Pagination */}

          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
            <button
              type="button"
              disabled={pagination.current_page <= 1}
              onClick={() => changePage(pagination.current_page - 1)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-sm text-gray-500">
              Page {pagination.current_page} of {pagination.last_page}
            </p>

            <button
              type="button"
              disabled={pagination.current_page >= pagination.last_page}
              onClick={() => changePage(pagination.current_page + 1)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default CompaniesPage;
