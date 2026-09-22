import api from '../../api/axios'

import type {
  AuthResponse,
  RegisterData,
  User,
} from './authTypes'

const register = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    '/register',
    data,
  )

  return response.data
}

const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/user')

  return response.data
}

export const authService = {
  register,
  getCurrentUser,
}