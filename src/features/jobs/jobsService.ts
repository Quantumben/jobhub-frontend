import api from '../../api/axios'

import type {
  CreateJobData,
  CreateJobResponse,
} from './jobTypes'


const createJob = async (
  data: CreateJobData,
): Promise<CreateJobResponse> => {

  const response =
    await api.post<CreateJobResponse>(
      '/jobs',
      data,
    )

  return response.data
}


export const jobsService = {
  createJob,
}