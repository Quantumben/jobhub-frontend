import { isAxiosError } from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { jobsService } from "./jobsService";

import type { CreateJobData, Job } from "./jobTypes";

import type { LaravelValidationResponse } from "../auth/authTypes";

interface JobsState {
  myJobs: Job[];
  selectedJob: Job | null;
  isLoadingMyJobs: boolean;
  isLoadingJob: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface UpdateJobArgs {
  id: number;
  data: CreateJobData;
}

const initialState: JobsState = {
  myJobs: [],
  selectedJob: null,
  isLoadingMyJobs: false,
  isLoadingJob: false,
  isCreating: false,
  isUpdating: false,
  error: null,
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
  },
});

export default jobsSlice.reducer;
