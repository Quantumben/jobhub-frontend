import { BriefcaseBusiness, Building2, MapPin } from "lucide-react";

import type { Company } from "../../features/companies/companyTypes";

interface MyCompanyCardProps {
  company: Company;
}

function MyCompanyCard({ company }: MyCompanyCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row">
        {/* Logo */}

        <div className="flex h-48 items-center justify-center bg-gray-100 sm:h-auto sm:w-48">
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

        {/* Content */}

        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>

          {company.location && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />

              {company.location}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <BriefcaseBusiness className="h-4 w-4" />
            {company.jobs_count ?? 0}{" "}
            {(company.jobs_count ?? 0) === 1 ? "job" : "jobs"}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 opacity-50"
            >
              Edit
            </button>

            <button
              type="button"
              disabled
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default MyCompanyCard;
