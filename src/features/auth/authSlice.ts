import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'

import type { User } from './authTypes'


interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitializing: boolean
}


const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
}


const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {

    setCredentials: (state, action: PayloadAction<User>,) =>
    {
      state.user = action.payload

      state.isAuthenticated = true

      state.isInitializing = false
    },


    clearAuth: (state) => {
      state.user = null

      state.isAuthenticated = false

      state.isInitializing = false
    },


    finishAuthInitialization: (state) => {
      state.isInitializing = false
    },

  },
})


export const {
  setCredentials,
  clearAuth,
  finishAuthInitialization,
} = authSlice.actions


export default authSlice.reducer