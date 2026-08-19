import { useState, useEffect } from "react";

let toastListeners = [];

export const toast = {
  show: (message, { tone = "success", duration = 3500 } = {}) => {
    const id = Math.random().toString(36).substring(2, 9);
    toastListeners.forEach((listener) => listener({ id, message, tone, duration }));
    return id;
  },
  success: (message, options) => toast.show(message, { tone: "success", ...options }),
  error: (message, options) => toast.show(message, { tone: "error", ...options }),
  info: (message, options) => toast.show(message, { tone: "info", ...options }),
  warning: (message, options) => toast.show(message, { tone: "warning", ...options }),
};

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (newToast) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    };

    toastListeners.push(handler);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== handler);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-100 text-slate-800 text-sm transition-all animate-in slide-in-from-top-3 duration-200"
          role="status"
        >
          {item.tone === "success" && (
            <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-xl shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {item.tone === "error" && (
            <div className="bg-rose-50 text-rose-600 p-1.5 rounded-xl shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          {item.tone === "info" && (
            <div className="bg-teal-50 text-teal-700 p-1.5 rounded-xl shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          {item.tone === "warning" && (
            <div className="bg-amber-50 text-amber-600 p-1.5 rounded-xl shrink-0 mt-0.5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          )}

          <div className="flex-1 font-medium text-slate-800 text-xs sm:text-sm pt-0.5 leading-snug">
            {item.message}
          </div>

          <button
            type="button"
            onClick={() => removeToast(item.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}

export default toast;
