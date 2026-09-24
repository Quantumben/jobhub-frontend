import { isAxiosError } from "axios";

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import { companiesService } from "./companiesService";

import type {
  CompaniesFilters,
  CompaniesResponse,
  Company,
  CompanyPagination,
} from "./companyTypes";

interface CompaniesState {
  companies: Company[];

  myCompanies: Company[];

  selectedCompany: Company | null;

  pagination: CompanyPagination;

  isLoadingCompanies: boolean;

  isLoadingMyCompanies: boolean;

  isLoadingCompany: boolean;

  companiesError: string | null;

  myCompaniesError: string | null;

  companyError: string | null;
}

const initialState: CompaniesState = {
  companies: [],

  myCompanies: [],

  selectedCompany: null,

  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  },

  isLoadingCompanies: false,

  isLoadingMyCompanies: false,

  isLoadingCompany: false,

  companiesError: null,

  myCompaniesError: null,

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

export const fetchMyCompanies = createAsyncThunk<
  Company[],
  void,
  {
    rejectValue: string;
  }
>(
  "companies/fetchMyCompanies",

  async (_, { rejectWithValue }) => {
    try {
      const response = await companiesService.getMyCompanies();

      return response.companies;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Unable to load your companies.",
        );
      }

      return rejectWithValue("Unable to load your companies.");
    }
  },
);

const companiesSlice = createSlice({
  name: "companies",

  initialState,

  reducers: {
    addMyCompany: (state, action: PayloadAction<Company>) => {
      state.myCompanies.unshift(action.payload);
    },

    replaceMyCompany: (state, action: PayloadAction<Company>) => {
      const index = state.myCompanies.findIndex(
        (company) => company.id === action.payload.id,
      );

      if (index !== -1) {
        state.myCompanies[index] = action.payload;
      }
    },

    removeMyCompany: (state, action: PayloadAction<number>) => {
      state.myCompanies = state.myCompanies.filter(
        (company) => company.id !== action.payload,
      );
    },
  },

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
      )

      /*
          |--------------------------------------------------------------------------
          | My Companies
          |--------------------------------------------------------------------------
          */

      .addCase(
        fetchMyCompanies.pending,

        (state) => {
          state.isLoadingMyCompanies = true;

          state.myCompaniesError = null;
        },
      )

      .addCase(
        fetchMyCompanies.fulfilled,

        (state, action) => {
          state.isLoadingMyCompanies = false;

          state.myCompanies = action.payload;
        },
      )

      .addCase(
        fetchMyCompanies.rejected,

        (state, action) => {
          state.isLoadingMyCompanies = false;

          state.myCompaniesError =
            action.payload ?? "Unable to load your companies.";
        },
      );
  },
});

export const { addMyCompany, replaceMyCompany, removeMyCompany } =
  companiesSlice.actions;

export default companiesSlice.reducer;
