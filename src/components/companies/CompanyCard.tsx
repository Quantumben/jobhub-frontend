import { Building2, BriefcaseBusiness, MapPin } from "lucide-react";

import { Link } from "react-router";

import type { Company } from "../../features/companies/companyTypes";

interface CompanyCardProps {
  company: Company;
}

function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Logo */}

      <div className="flex h-40 items-center justify-center bg-gray-50">
        {company.logo ? (
          <img
            src={company.logo}
            alt={company.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Building2 className="h-16 w-16 text-gray-300" />
        )}
      </div>

      {/* Content */}

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>

        {company.location && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />

            <span>{company.location}</span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <BriefcaseBusiness className="h-4 w-4" />

          <span>
            {company.active_jobs_count}{" "}
            {company.active_jobs_count === 1 ? "open job" : "open jobs"}
          </span>
        </div>

        {company.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
            {company.description}
          </p>
        )}

        <Link
          to={`/companies/${company.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Company
        </Link>
      </div>
    </article>
  );
}

export default CompanyCard;
