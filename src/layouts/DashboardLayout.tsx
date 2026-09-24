import {
  BriefcaseBusiness,
  CircleUserRound,
  LayoutDashboard,
  PlusCircle,
  Building2,
} from "lucide-react";

import { NavLink, Outlet } from "react-router";

function DashboardLayout() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Dashboard
          </p>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              end
              className={navLinkClass}
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </NavLink>

            <NavLink
              to="/dashboard/jobs"
              className={navLinkClass}
            >
              <BriefcaseBusiness className="h-5 w-5" />
              My Jobs
            </NavLink>

            <NavLink
              to="/dashboard/jobs/create"
              className={navLinkClass}
            >
              <PlusCircle className="h-5 w-5" />
              Post a Job
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className={navLinkClass}
            >
              <CircleUserRound className="h-5 w-5" />
              Profile
            </NavLink>

            <NavLink to="/dashboard/companies" className={navLinkClass}>
              <Building2 className="h-5 w-5" />
              My Companies
            </NavLink>
          </nav>
        </aside>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default DashboardLayout;
