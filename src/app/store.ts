import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobsSlice";
import toastReducer from "../features/toasts/toastSlice";
import companiesReducer from "../features/companies/companiesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    companies: companiesReducer,
    toasts: toastReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
