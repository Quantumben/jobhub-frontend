import api from "../../api/axios";

import type {
  CompaniesFilters,
  CompaniesResponse,
  CompanyFormData,
  CompanyMutationResponse,
  CompanyResponse,
  MyCompaniesResponse,
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

const getMyCompanies = async (): Promise<MyCompaniesResponse> => {
  const response = await api.get<MyCompaniesResponse>("/my-companies");

  return response.data;
};

const createCompany = async (
  data: CompanyFormData,
): Promise<CompanyMutationResponse> => {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.website) {
    formData.append("website", data.website);
  }

  if (data.location) {
    formData.append("location", data.location);
  }

  if (data.description) {
    formData.append("description", data.description);
  }

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const response = await api.post<CompanyMutationResponse>(
    "/companies",
    formData,
  );

  return response.data;
};

export const companiesService = {
  getCompanies,
  getCompany,
  getMyCompanies,
  createCompany,
}
