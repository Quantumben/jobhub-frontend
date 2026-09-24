import api from "../../api/axios";

import type {
  CompaniesFilters,
  CompaniesResponse,
  CompanyResponse,
} from "./companyTypes";

const getCompanies = async (
  filters: CompaniesFilters,
): Promise<CompaniesResponse> => {
  const response = await api.get<CompaniesResponse>("/companies", {
    params: {
      search: filters.search || undefined,

      location: filters.location || undefined,

      page: filters.page,
    },
  });

  return response.data;
};

const getCompany = async (id: number): Promise<CompanyResponse> => {
  const response = await api.get<CompanyResponse>(`/companies/${id}`);

  return response.data;
};

export const companiesService = {
  getCompanies,
  getCompany,
};
