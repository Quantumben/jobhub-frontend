import * as Yup from "yup";

export const companySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name cannot exceed 150 characters")
    .required("Company name is required"),

  website: Yup.string()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .url("Enter a valid website URL")
    .optional(),

  location: Yup.string()
    .trim()
    .max(150, "Location cannot exceed 150 characters")
    .optional(),

  description: Yup.string()
    .trim()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional(),

  logo: Yup.mixed<File>()
    .nullable()

    .test(
      "file-size",

      "Logo must not exceed 2 MB",

      (file) => {
        if (!file) {
          return true;
        }

        return file.size <= 2 * 1024 * 1024;
      },
    )

    .test(
      "file-type",

      "Only JPG, JPEG, PNG and WEBP images are allowed",

      (file) => {
        if (!file) {
          return true;
        }

        return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      },
    ),
});
