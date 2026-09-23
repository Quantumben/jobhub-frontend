import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router'

function MyJobsPage() {
  return (
    <div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Jobs
          </h1>

          <p className="mt-2 text-gray-600">
            Manage all jobs you have posted.
          </p>
        </div>


        <Link
          to="/dashboard/jobs/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />

          Post New Job
        </Link>

      </div>


      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">

        <p className="text-center text-gray-500">
          Your job listings will appear here.
        </p>

      </div>

    </div>
  )
}

export default MyJobsPage