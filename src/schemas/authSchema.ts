import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot be more than 100 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  password_confirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string().required("Password is required"),
});

export const profileSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export const changePasswordSchema = Yup.object({
  current_password: Yup.string().required("Current password is required"),

  password: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .required("New password is required"),

  password_confirmation: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
