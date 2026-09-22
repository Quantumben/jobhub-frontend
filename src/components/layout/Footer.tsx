import { Link } from "react-router";
import { BriefcaseBusiness } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-blue-600"
            >
              <BriefcaseBusiness className="h-6 w-6" />

              <span>JobHub</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              Helping talented people discover their next opportunity and
              helping companies find great talent.
            </p>
          </div>

          {/* Job Links */}
          <div>
            <h3 className="font-semibold text-gray-900">For Job Seekers</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/jobs"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Browse Jobs
              </Link>

              <Link
                to="/companies"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Companies
              </Link>
            </div>
          </div>

          {/* Employer Links */}
          <div>
            <h3 className="font-semibold text-gray-900">For Employers</h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/register"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Post a Job
              </Link>

              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Employer Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} JobHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
