import api from '../../api/axios'

import type {
  CreateJobData,
  CreateJobResponse,
} from './jobTypes'


const createJob = async (data: CreateJobData,): Promise<CreateJobResponse> =>
{

  const formData = new FormData()

  formData.append(
    'title',
    data.title,
  )

  formData.append(
    'company',
    data.company,
  )

  formData.append(
    'location',
    data.location,
  )

  formData.append(
    'job_type',
    data.job_type,
  )

  formData.append(
    'work_mode',
    data.work_mode,
  )

  if (data.salary_min) {
    formData.append(
      'salary_min',
      data.salary_min,
    )
  }

  if (data.salary_max) {
    formData.append(
      'salary_max',
      data.salary_max,
    )
  }

  formData.append(
    'description',
    data.description,
  )

  formData.append(
    'requirements',
    data.requirements,
  )

  if (data.application_url) {
    formData.append(
      'application_url',
      data.application_url,
    )
  }

  if (data.image) {
    formData.append(
      'image',
      data.image,
    )
  }

  const response = await api.post<CreateJobResponse>('/jobs', formData,)


  return response.data
}


export const jobsService = {
  createJob,
}