import { isAxiosError } from 'axios'

import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'

import { jobsService } from './jobsService'

import type {
  CreateJobData,
  Job,
} from './jobTypes'

import type {
  LaravelValidationResponse,
} from '../auth/authTypes'


interface JobsState {
  myJobs: Job[]
  isLoadingMyJobs: boolean
  isCreating: boolean
  error: string | null
}


const initialState: JobsState = {
  myJobs: [],
  isLoadingMyJobs: false,
  isCreating: false,
  error: null,
}


export const createJob =
  createAsyncThunk<Job,CreateJobData,{rejectValue: LaravelValidationResponse}>
  (
    'jobs/createJob',

    async (jobData,{rejectWithValue,},) =>
    {
      try {
        const response =
          await jobsService.createJob(
            jobData,
          )

        return response.job

      } catch (error) {

        if (isAxiosError<LaravelValidationResponse>(error,) && error.response?.status === 422)
        {
          return rejectWithValue(
            error.response.data,
          )
        }

        throw error
      }
    },
  )


  export const fetchMyJobs = createAsyncThunk<Job[], void,{rejectValue: string}>
  (
    'jobs/fetchMyJobs',

    async (_,{rejectWithValue,},) =>
    {
      try {

        const response = await jobsService.getMyJobs()

        return response.jobs

      } catch (error) {

        if (isAxiosError(error)) {

          return rejectWithValue(
            error.response?.data?.message ??
            'Unable to load your jobs.',
          )
        }

        return rejectWithValue(
          'Unable to load your jobs.',
        )
      }
    },
  )

const jobsSlice = createSlice({
  name: 'jobs',

  initialState,

  reducers: {},

  extraReducers: (builder) => {

    // Creating Job
    builder

      .addCase(
        createJob.pending,

        (state) => {
          state.isCreating = true
          state.error = null
        },
      )


      .addCase(
        createJob.fulfilled,

        (state, action) => {
          state.isCreating = false

          state.myJobs.unshift(
            action.payload,
          )
        },
      )


      .addCase(
        createJob.rejected,

        (state, action) => {
          state.isCreating = false

          state.error =
            action.payload?.message ??
            action.error.message ??
            'Unable to create job.'
        },
    )

    // Fetching Jobs
    builder

        .addCase(
            fetchMyJobs.pending,

            (state) => {
            state.isLoadingMyJobs = true

            state.error = null
            },
        )

        .addCase(
            fetchMyJobs.fulfilled,

            (state, action) => {
            state.isLoadingMyJobs = false

            state.myJobs =
                action.payload
            },
        )

        .addCase(
            fetchMyJobs.rejected,

            (state, action) => {
            state.isLoadingMyJobs = false

            state.error =
                action.payload ??
                'Unable to load your jobs.'
            },
        )
  },
})


export default jobsSlice.reducer