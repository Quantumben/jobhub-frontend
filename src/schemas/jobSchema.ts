import * as Yup from 'yup'


export const jobSchema = Yup.object({

  title: Yup.string()
    .trim()
    .min(
      2,
      'Job title must be at least 2 characters',
    )
    .max(
      150,
      'Job title cannot exceed 150 characters',
    )
    .required(
      'Job title is required',
    ),


  company: Yup.string()
    .trim()
    .min(
      2,
      'Company name must be at least 2 characters',
    )
    .max(
      150,
      'Company name cannot exceed 150 characters',
    )
    .required(
      'Company name is required',
    ),


  location: Yup.string()
    .trim()
    .required(
      'Location is required',
    ),


  job_type: Yup.string()
    .oneOf(
      [
        'full_time',
        'part_time',
        'contract',
        'internship',
      ],
      'Select a valid job type',
    )
    .required(
      'Job type is required',
    ),


  work_mode: Yup.string()
    .oneOf(
      [
        'onsite',
        'remote',
        'hybrid',
      ],
      'Select a valid work mode',
    )
    .required(
      'Work mode is required',
    ),


  salary_min: Yup.number()
    .transform(
      (value, originalValue) =>
        originalValue === ''
          ? undefined
          : value,
    )
    .typeError(
      'Minimum salary must be a number',
    )
    .min(
      0,
      'Minimum salary cannot be negative',
    )
    .optional(),


  salary_max: Yup.number()
    .transform(
      (value, originalValue) =>
        originalValue === ''
          ? undefined
          : value,
    )
    .typeError(
      'Maximum salary must be a number',
    )
    .min(
      0,
      'Maximum salary cannot be negative',
    )
    .optional(),


  description: Yup.string()
    .trim()
    .min(
      20,
      'Description must be at least 20 characters',
    )
    .required(
      'Job description is required',
    ),


  requirements: Yup.string()
    .trim()
    .min(
      10,
      'Requirements must be at least 10 characters',
    )
    .required(
      'Job requirements are required',
    ),


  application_url: Yup.string()
    .transform(
      (value, originalValue) =>
        originalValue === ''
          ? undefined
          : value,
    )
    .url(
      'Enter a valid application URL',
    )
    .optional(),

})