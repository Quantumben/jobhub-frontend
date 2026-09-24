import { isAxiosError } from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { companiesService } from "./companiesService";

import type {
  CompaniesFilters,
  CompaniesResponse,
  Company,
  CompanyPagination,
} from "./companyTypes";

interface CompaniesState {
  companies: Company[];

  selectedCompany: Company | null;

  pagination: CompanyPagination;

  isLoadingCompanies: boolean;

  isLoadingCompany: boolean;

  companiesError: string | null;

  companyError: string | null;
}

const initialState: CompaniesState = {
  companies: [],

  selectedCompany: null,

  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  },

  isLoadingCompanies: false,

  isLoadingCompany: false,

  companiesError: null,

  companyError: null,
};

/*
|--------------------------------------------------------------------------
| Fetch Companies
|--------------------------------------------------------------------------
*/

export const fetchCompanies = createAsyncThunk<
  CompaniesResponse,
  CompaniesFilters,
  {
    rejectValue: string;
  }
>(
  "companies/fetchCompanies",

  async (filters, { rejectWithValue }) => {
    try {
      return await companiesService.getCompanies(filters);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Unable to load companies.",
        );
      }

      return rejectWithValue("Unable to load companies.");
    }
  },
);

/*
|--------------------------------------------------------------------------
| Fetch One Company
|--------------------------------------------------------------------------
*/

export const fetchCompany = createAsyncThunk<
  Company,
  number,
  {
    rejectValue: string;
  }
>(
  "companies/fetchCompany",

  async (id, { rejectWithValue }) => {
    try {
      const response = await companiesService.getCompany(id);

      return response.company;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          return rejectWithValue("Company not found.");
        }

        return rejectWithValue(
          error.response?.data?.message ?? "Unable to load company.",
        );
      }

      return rejectWithValue("Unable to load company.");
    }
  },
);

const companiesSlice = createSlice({
  name: "companies",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /*
          |--------------------------------------------------------------------------
          | Companies
          |--------------------------------------------------------------------------
          */

      .addCase(
        fetchCompanies.pending,

        (state) => {
          state.isLoadingCompanies = true;

          state.companiesError = null;
        },
      )

      .addCase(
        fetchCompanies.fulfilled,

        (state, action) => {
          state.isLoadingCompanies = false;

          state.companies = action.payload.companies;

          state.pagination = action.payload.pagination;
        },
      )

      .addCase(
        fetchCompanies.rejected,

        (state, action) => {
          state.isLoadingCompanies = false;

          state.companiesError = action.payload ?? "Unable to load companies.";
        },
      )

      /*
          |--------------------------------------------------------------------------
          | One Company
          |--------------------------------------------------------------------------
          */

      .addCase(
        fetchCompany.pending,

        (state) => {
          state.isLoadingCompany = true;

          state.companyError = null;

          state.selectedCompany = null;
        },
      )

      .addCase(
        fetchCompany.fulfilled,

        (state, action) => {
          state.isLoadingCompany = false;

          state.selectedCompany = action.payload;
        },
      )

      .addCase(
        fetchCompany.rejected,

        (state, action) => {
          state.isLoadingCompany = false;

          state.companyError = action.payload ?? "Unable to load company.";
        },
      );
  },
});

export default companiesSlice.reducer;
