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
  items: Job[]
  isCreating: boolean
  error: string | null
}


const initialState: JobsState = {
  items: [],
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


const jobsSlice = createSlice({
  name: 'jobs',

  initialState,

  reducers: {},

  extraReducers: (builder) => {

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

          state.items.unshift(
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
  },
})


export default jobsSlice.reducer