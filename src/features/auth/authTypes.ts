export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface LaravelValidationResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}
