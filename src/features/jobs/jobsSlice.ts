import { isAxiosError } from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { jobsService } from "./jobsService";

import type {
  CreateJobData,
  Job,
  PaginationMeta,
  PublicJobsFilters,
  PublicJobsResponse,
  //   UpdateJobArgs,
} from "./jobTypes";

import type { LaravelValidationResponse } from "../auth/authTypes";

interface JobsState {
  myJobs: Job[];
  publicJobs: Job[];
  selectedJob: Job | null;
  publicPagination: PaginationMeta;
  isLoadingMyJobs: boolean;
  isLoadingPublicJobs: boolean;
  isLoadingJob: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  publicJobsError: string | null;
}

interface UpdateJobArgs {
  id: number;
  data: CreateJobData;
}

const initialState: JobsState = {
  myJobs: [],
  publicJobs: [],
  selectedJob: null,
  publicPagination: {
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
  },
  isLoadingMyJobs: false,
  isLoadingPublicJobs: false,
  isLoadingJob: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  publicJobsError: null,
};

export const createJob = createAsyncThunk<
  Job,
  CreateJobData,
  { rejectValue: LaravelValidationResponse }
>(
  "jobs/createJob",

  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobsService.createJob(jobData);

      return response.job;
    } catch (error) {
      if (
        isAxiosError<LaravelValidationResponse>(error) &&
        error.response?.status === 422
      ) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  },
);

export const fetchMyJobs = createAsyncThunk<
  Job[],
  void,
  { rejectValue: string }
>(
  "jobs/fetchMyJobs",

  async (_, { rejectWithValue }) => {
    try {
      const response = await jobsService.getMyJobs();

      return response.jobs;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Unable to load your jobs.",
        );
      }

      return rejectWithValue("Unable to load your jobs.");
    }
  },
);

// fetch single by ID
export const fetchMyJob = createAsyncThunk<
  Job,
  number,
  { rejectValue: string }
>(
  "jobs/fetchMyJob",

  async (id, { rejectWithValue }) => {
    try {
      const response = await jobsService.getMyJob(id);

      return response.job;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Unable to load job.",
        );
      }

      return rejectWithValue("Unable to load job.");
    }
  },
);

export const updateJob = createAsyncThunk<
  Job,
  UpdateJobArgs,
  { rejectValue: LaravelValidationResponse }
>(
  "jobs/updateJob",

  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await jobsService.updateJob(id, data);

      return response.job;
    } catch (error) {
      if (
        isAxiosError<LaravelValidationResponse>(error) &&
        error.response?.status === 422
      ) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  },
);

export const deleteJob = createAsyncThunk<
  number,
  number,
  {
    rejectValue: string;
  }
>(
  "jobs/deleteJob",

  async (id, { rejectWithValue }) => {
    try {
      await jobsService.deleteJob(id);

      /*
        |--------------------------------------------------------------------------
        | Important
        |--------------------------------------------------------------------------
        |
        | Laravel doesn't need to return the deleted Job.
        |
        | We already know which ID we deleted.
        |
        */

      return id;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Unable to delete job.",
        );
      }

      return rejectWithValue("Unable to delete job.");
    }
  },
);

//FETCH PUBLIC JOBS

export const fetchPublicJobs = createAsyncThunk<
  PublicJobsResponse,
  PublicJobsFilters,
  {
    rejectValue: string;
  }
>(
  "jobs/fetchPublicJobs",

  async (filters, { rejectWithValue }) => {
    try {
      return await jobsService.getPublicJobs(filters);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message ?? "Unable to load jobs.",
        );
      }

      return rejectWithValue("Unable to load jobs.");
    }
  },
);

const jobsSlice = createSlice({
  name: "jobs",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    // Creating Job
    builder

      .addCase(
        createJob.pending,

        (state) => {
          state.isCreating = true;
          state.error = null;
        },
      )

      .addCase(
        createJob.fulfilled,

        (state, action) => {
          state.isCreating = false;

          state.myJobs.unshift(action.payload);
        },
      )

      .addCase(
        createJob.rejected,

        (state, action) => {
          state.isCreating = false;

          state.error =
            action.payload?.message ??
            action.error.message ??
            "Unable to create job.";
        },
      );

    // Fetching Jobs
    builder

      .addCase(
        fetchMyJobs.pending,

        (state) => {
          state.isLoadingMyJobs = true;

          state.error = null;
        },
      )

      .addCase(
        fetchMyJobs.fulfilled,

        (state, action) => {
          state.isLoadingMyJobs = false;

          state.myJobs = action.payload;
        },
      )

      .addCase(
        fetchMyJobs.rejected,

        (state, action) => {
          state.isLoadingMyJobs = false;

          state.error = action.payload ?? "Unable to load your jobs.";
        },
      );

    // fetchMyJob

    builder

      .addCase(
        fetchMyJob.pending,

        (state) => {
          state.isLoadingJob = true;

          state.error = null;

          state.selectedJob = null;
        },
      )

      .addCase(
        fetchMyJob.fulfilled,

        (state, action) => {
          state.isLoadingJob = false;

          state.selectedJob = action.payload;
        },
      )

      .addCase(
        fetchMyJob.rejected,

        (state, action) => {
          state.isLoadingJob = false;

          state.error = action.payload ?? "Unable to load job.";
        },
      );

    //update Job reducer
    builder

      .addCase(
        updateJob.pending,

        (state) => {
          state.isUpdating = true;

          state.error = null;
        },
      )

      .addCase(
        updateJob.fulfilled,

        (state, action) => {
          state.isUpdating = false;

          state.selectedJob = action.payload;

          const index = state.myJobs.findIndex(
            (job) => job.id === action.payload.id,
          );

          if (index !== -1) {
            state.myJobs[index] = action.payload;
          }
        },
      )

      .addCase(
        updateJob.rejected,

        (state, action) => {
          state.isUpdating = false;

          state.error =
            action.payload?.message ??
            action.error.message ??
            "Unable to update job.";
        },
      );

    //delete Job Reducer
    builder

      .addCase(
        deleteJob.pending,

        (state) => {
          state.isDeleting = true;

          state.error = null;
        },
      )

      .addCase(
        deleteJob.fulfilled,

        (state, action) => {
          state.isDeleting = false;

          state.myJobs = state.myJobs.filter(
            (job) => job.id !== action.payload,
          );

          if (state.selectedJob?.id === action.payload) {
            state.selectedJob = null;
          }
        },
      )

      .addCase(
        deleteJob.rejected,

        (state, action) => {
          state.isDeleting = false;

          state.error =
            action.payload ?? action.error.message ?? "Unable to delete job.";
        },
      );

    //   fetch Public jobs reducer
    builder

      .addCase(
        fetchPublicJobs.pending,

        (state) => {
          state.isLoadingPublicJobs = true;

          state.publicJobsError = null;
        },
      )

      .addCase(
        fetchPublicJobs.fulfilled,

        (state, action) => {
          state.isLoadingPublicJobs = false;

          state.publicJobs = action.payload.jobs;

          state.publicPagination = action.payload.pagination;
        },
      )

      .addCase(
        fetchPublicJobs.rejected,

        (state, action) => {
          state.isLoadingPublicJobs = false;

          state.publicJobsError = action.payload ?? "Unable to load jobs.";
        },
      );
  },
});

export default jobsSlice.reducer;
