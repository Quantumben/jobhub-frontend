import { useParams } from "react-router";

function JobDetailsPage() {
  const { id } = useParams();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <p className="text-sm font-semibold text-blue-600">Job ID: {id}</p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">Job Details</h1>

        <p className="mt-4 text-gray-600">
          The full information for this job will appear here.
        </p>
      </div>
    </section>
  );
}

export default JobDetailsPage;
