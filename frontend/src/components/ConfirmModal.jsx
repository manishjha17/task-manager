import React from 'react';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, taskTitle }) {
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      ></div>

      {/* Modal card */}
      <div className="glass-panel p-6 rounded-2xl max-w-sm w-full relative z-10 shadow-2xl border border-white/5 animate-scaleUp flex flex-col gap-4 text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div>
          <h3 className="text-lg font-bold font-display text-white">Delete Task?</h3>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Are you sure you want to delete <span className="text-slate-200 font-semibold">"{taskTitle}"</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white border border-white/5 bg-slate-900/25 hover:bg-slate-900/50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/25 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
