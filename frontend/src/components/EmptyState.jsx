import React from 'react';

export default function EmptyState({ statusFilter, searchQuery, onClear }) {
  const isFiltered = statusFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center border border-white/5 py-16 animate-fadeIn select-none">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>

      <h3 className="text-lg font-bold font-display text-white">No tasks here</h3>
      <p className="text-slate-400 text-sm mt-1 max-w-xs font-medium">
        {isFiltered
          ? "No tasks match your active filters or search terms."
          : "Your board is empty. Add a new task above to get started!"}
      </p>

      {isFiltered && (
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
        >
          Reset Filters & Search
        </button>
      )}
    </div>
  );
}
