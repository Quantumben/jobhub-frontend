import { useEffect, type ComponentType } from "react";

import { CircleAlert, CircleCheck, CircleX, Info, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  removeToast,
  type Toast,
  type ToastType,
} from "../../features/toasts/toastSlice";

/*
|--------------------------------------------------------------------------
| Toast Configuration
|--------------------------------------------------------------------------
*/

interface ToastConfig {
  icon: ComponentType<{
    className?: string;
  }>;

  wrapperClass: string;

  iconClass: string;
}

const toastConfig: Record<ToastType, ToastConfig> = {
  success: {
    icon: CircleCheck,

    wrapperClass: "border-green-200 bg-white",

    iconClass: "text-green-600",
  },

  error: {
    icon: CircleX,

    wrapperClass: "border-red-200 bg-white",

    iconClass: "text-red-600",
  },

  warning: {
    icon: CircleAlert,

    wrapperClass: "border-amber-200 bg-white",

    iconClass: "text-amber-600",
  },

  info: {
    icon: Info,

    wrapperClass: "border-blue-200 bg-white",

    iconClass: "text-blue-600",
  },
};

/*
|--------------------------------------------------------------------------
| Toast Item
|--------------------------------------------------------------------------
*/

interface ToastItemProps {
  toast: Toast;
}

function ToastItem({ toast }: ToastItemProps) {
  const dispatch = useAppDispatch();

  /*
  |--------------------------------------------------------------------------
  | Automatically Remove Toast
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    /*
    | duration = 0 means:
    |
    | Do not automatically remove.
    */

    if (toast.duration === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, toast.duration);

    /*
    |--------------------------------------------------------------------------
    | Cleanup Timer
    |--------------------------------------------------------------------------
    */

    return () => {
      window.clearTimeout(timer);
    };
  }, [dispatch, toast.id, toast.duration]);

  /*
  |--------------------------------------------------------------------------
  | Style
  |--------------------------------------------------------------------------
  */

  const config = toastConfig[toast.type];

  const Icon = config.icon;

  /*
  |--------------------------------------------------------------------------
  | Accessibility Role
  |--------------------------------------------------------------------------
  */

  const role = toast.type === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-4 shadow-lg ${config.wrapperClass}`}
    >
      {/* Icon */}

      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.iconClass}`} />

      {/* Message */}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-5 text-gray-800">
          {toast.message}
        </p>
      </div>

      {/* Close */}

      <button
        type="button"
        aria-label="Close notification"
        onClick={() => dispatch(removeToast(toast.id))}
        className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Toast Container
|--------------------------------------------------------------------------
*/

function ToastContainer() {
  const toasts = useAppSelector((state) => state.toasts.items);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-0 top-4 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:right-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export default ToastContainer;
