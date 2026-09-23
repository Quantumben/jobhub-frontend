import api from "../../api/axios";

import type {
  AuthResponse,
  LoginData,
  RegisterData,
  UpdateProfileData,
  UpdateProfileResponse,
  User,
} from "./authTypes";

const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/register", data);

  return response.data;
};

const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/login", data);

  return response.data;
};

const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>("/user");

  return response.data;
};

const logout = async (): Promise<void> => {
  await api.post("/logout");
};

const updateProfile = async (
  data: UpdateProfileData,
): Promise<UpdateProfileResponse> => {
  const response = await api.patch<UpdateProfileResponse>("/profile", data);

  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
};
