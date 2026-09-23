import { AlertTriangle, X } from "lucide-react";

interface DeleteJobModalProps {
  jobTitle: string;

  isDeleting: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}

function DeleteJobModal({
  jobTitle,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteJobModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}

      <button
        type="button"
        aria-label="Close delete confirmation"
        disabled={isDeleting}
        onClick={onCancel}
        className="absolute inset-0 bg-black/50"
      />

      {/* Modal */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-job-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* Close */}

        <button
          type="button"
          aria-label="Close"
          disabled={isDeleting}
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Content */}

        <h2
          id="delete-job-title"
          className="mt-5 text-xl font-bold text-gray-900"
        >
          Delete this job?
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-600">
          You are about to permanently delete{" "}
          <span className="font-semibold text-gray-900">{jobTitle}</span>. This
          action cannot be undone.
        </p>

        {/* Actions */}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isDeleting}
            onClick={onCancel}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete Job"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteJobModal;
