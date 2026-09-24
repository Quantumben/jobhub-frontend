import type { Job } from "../jobs/jobTypes";

export interface Company {
  id: number;

  user_id: number;

  name: string;

  website: string | null;

  location: string | null;

  description: string | null;

  logo: string | null;

  logo_public_id: string | null;

  status: string;

  active_jobs_count: number;

  jobs?: Job[];

  created_at: string;

  updated_at: string;
}

export interface CompanyPagination {
  current_page: number;

  last_page: number;

  per_page: number;

  total: number;
}

export interface CompaniesResponse {
  companies: Company[];

  pagination: CompanyPagination;
}

export interface CompanyResponse {
  company: Company;
}

export interface CompaniesFilters {
  search: string;

  location: string;

  page: number;
}
