import { useCallback, useEffect, useState } from "react";

import { AlertCircle, BriefcaseBusiness, MapPin, Search } from "lucide-react";

import { useSearchParams } from "react-router";

import { useAppDispatch, useAppSelector } from "../app/hooks";

import PublicJobCard from "../components/jobs/PublicJobCard";

import { fetchPublicJobs } from "../features/jobs/jobsSlice";

function JobsPage() {
  /*
  |--------------------------------------------------------------------------
  | Redux
  |--------------------------------------------------------------------------
  */

  const dispatch = useAppDispatch();

  const { publicJobs, publicPagination, isLoadingPublicJobs, publicJobsError } =
    useAppSelector((state) => state.jobs);

  /*
  |--------------------------------------------------------------------------
  | URL Search Parameters
  |--------------------------------------------------------------------------
  */

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";

  const location = searchParams.get("location") ?? "";

  const jobType = searchParams.get("job_type") ?? "";

  const workMode = searchParams.get("work_mode") ?? "";

  const requestedPage = Number(searchParams.get("page") ?? "1");

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  /*
  |--------------------------------------------------------------------------
  | Search Input State
  |--------------------------------------------------------------------------
  |
  | These are separate from the URL because we want to debounce typing.
  |
  */

  const [searchInput, setSearchInput] = useState(search);

  const [locationInput, setLocationInput] = useState(location);

  /*
  |--------------------------------------------------------------------------
  | Keep Inputs Synced With URL
  |--------------------------------------------------------------------------
  |
  | Important for browser Back / Forward.
  |
  */

  useCallback(() => {
    setSearchInput(search);
    setLocationInput(location);
  }, [search, location]);

  //   useEffect(() => {
  //     setSearchInput(search);

  //     setLocationInput(location);
  //   }, [search, location]);

  /*
  |--------------------------------------------------------------------------
  | Debounce Search + Location
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchParams(
        (currentParams) => {
          const nextParams = new URLSearchParams(currentParams);

          const trimmedSearch = searchInput.trim();

          const trimmedLocation = locationInput.trim();

          if (trimmedSearch) {
            nextParams.set("search", trimmedSearch);
          } else {
            nextParams.delete("search");
          }

          if (trimmedLocation) {
            nextParams.set("location", trimmedLocation);
          } else {
            nextParams.delete("location");
          }

          /*
              |--------------------------------------------------------------------------
              | Filters changed
              |--------------------------------------------------------------------------
              |
              | Go back to page 1.
              |
              */

          nextParams.delete("page");

          return nextParams;
        },
        {
          replace: true,
        },
      );
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchInput, locationInput, setSearchParams]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Jobs Whenever URL Filters Change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(
      fetchPublicJobs({
        search,

        location,

        job_type: jobType,

        work_mode: workMode,

        page,
      }),
    );
  }, [dispatch, search, location, jobType, workMode, page]);

  /*
  |--------------------------------------------------------------------------
  | Update One Query Parameter
  |--------------------------------------------------------------------------
  */

  const updateFilter = (key: string, value: string) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (value) {
        nextParams.set(key, value);
      } else {
        nextParams.delete(key);
      }

      /*
        | Filter changed.
        | Start again at page 1.
        */

      nextParams.delete("page");

      return nextParams;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Change Page
  |--------------------------------------------------------------------------
  */

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > publicPagination.last_page) {
      return;
    }

    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      if (newPage === 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", newPage.toString());
      }

      return nextParams;
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Clear All Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearchInput("");

    setLocationInput("");

    setSearchParams({});
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}

      <div className="max-w-2xl">
        <p className="text-sm font-semibold text-blue-600">Opportunities</p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Find your next job
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Search available opportunities and find the role that fits you.
        </p>
      </div>

      {/* Filters */}

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Search */}

          <div>
            <label
              htmlFor="job-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                id="job-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Job title, company or keyword"
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Location */}

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location
            </label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

              <input
                id="location"
                type="search"
                value={locationInput}
                onChange={(event) => setLocationInput(event.target.value)}
                placeholder="London, Manchester..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          {/* Job Type */}

          <div>
            <label
              htmlFor="job-type"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Job Type
            </label>

            <select
              id="job-type"
              value={jobType}
              onChange={(event) => updateFilter("job_type", event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Job Types</option>

              <option value="full_time">Full Time</option>

              <option value="part_time">Part Time</option>

              <option value="contract">Contract</option>

              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Work Mode */}

          <div>
            <label
              htmlFor="work-mode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Work Mode
            </label>

            <select
              id="work-mode"
              value={workMode}
              onChange={(event) =>
                updateFilter("work_mode", event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All Work Modes</option>

              <option value="onsite">On-site</option>

              <option value="remote">Remote</option>

              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Clear */}

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 lg:w-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header */}

      <div className="mt-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Job Opportunities
          </h2>

          {!isLoadingPublicJobs && (
            <p className="mt-1 text-sm text-gray-500">
              {publicPagination.total}{" "}
              {publicPagination.total === 1 ? "job" : "jobs"} found
            </p>
          )}
        </div>
      </div>

      {/* Loading */}

      {isLoadingPublicJobs && (
        <div className="mt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="h-48 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />

                  <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="h-11 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}

      {!isLoadingPublicJobs && publicJobsError && (
        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />

            <div>
              <p className="font-semibold text-red-700">Unable to load jobs</p>

              <p className="mt-1 text-sm text-red-600">{publicJobsError}</p>

              <button
                type="button"
                onClick={() =>
                  dispatch(
                    fetchPublicJobs({
                      search,
                      location,
                      job_type: jobType,
                      work_mode: workMode,
                      page,
                    }),
                  )
                }
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty */}

      {!isLoadingPublicJobs && !publicJobsError && publicJobs.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <BriefcaseBusiness className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            No jobs found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-gray-500">
            Try changing your search terms or removing some filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Jobs */}

      {!isLoadingPublicJobs && !publicJobsError && publicJobs.length > 0 && (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicJobs.map((job) => (
              <PublicJobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination */}

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">
            <p className="text-sm text-gray-500">
              Page{" "}
              <span className="font-semibold text-gray-900">
                {publicPagination.current_page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {publicPagination.last_page}
              </span>
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={publicPagination.current_page <= 1}
                onClick={() => changePage(publicPagination.current_page - 1)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  publicPagination.current_page >= publicPagination.last_page
                }
                onClick={() => changePage(publicPagination.current_page + 1)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default JobsPage;
