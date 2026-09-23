import { useEffect, type ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  clearAuth,
  finishAuthInitialization,
  setCredentials,
} from "../../features/auth/authSlice";

import { authService } from "../../features/auth/authService";

interface AuthInitializerProps {
  children: ReactNode;
}

function AuthInitializer({ children }: AuthInitializerProps) {
  const dispatch = useAppDispatch();

  const isInitializing = useAppSelector((state) => state.auth.isInitializing);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        dispatch(finishAuthInitialization());

        return;
      }

      try {
        const user = await authService.getCurrentUser();

        dispatch(setCredentials(user));
      } catch {
        localStorage.removeItem("auth_token");

        dispatch(clearAuth());
      }
    };

    restoreUser();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return children;
}

export default AuthInitializer;
