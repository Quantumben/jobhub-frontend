import { Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import JobsPage from "../pages/JobsPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import CompaniesPage from "../pages/CompaniesPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="jobs" element={<JobsPage />} />

        <Route path="jobs/:id" element={<JobDetailsPage />} />

        <Route path="companies" element={<CompaniesPage />} />

        <Route path="login" element={<LoginPage />} />

        <Route path="register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

// index route means: This is the default child displayed when the parent route itself is visited.
// <Routes> contains our route configuration.
// <Route /> connects a URL to a component.
// <Outlet /> is where a child route gets rendered inside its parent layout.
// <Link to="/jobs"> navigates without a normal full-page reload.
// <NavLink /> lets us know whether that navigation link is currently active.