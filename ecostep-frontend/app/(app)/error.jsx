"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import PropTypes from 'prop-types';

export default function AppError({ error, reset }) {
  useEffect(() => {
    // Log error to tracking service if available
    console.error("Dashboard Error Caught by Boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Something went wrong!</h2>
      <p className="text-zinc-400 mb-8 max-w-md">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all hover:scale-[1.02]"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

AppError.propTypes = {
  error: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
};
