import React from 'react';

export default function Header({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <header className="glass-panel p-6 rounded-2xl mb-6 shadow-xl relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-x-10 translate-y-10"></div>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent m-0 select-none">
            ZenTask
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            Your personal full-stack productivity space
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center glass-card px-4 py-2 rounded-xl min-w-24 border border-white/5">
            <span className="text-2xl font-bold text-blue-400 font-display">{active}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active</span>
          </div>

          <div className="flex flex-col items-center glass-card px-4 py-2 rounded-xl min-w-24 border border-white/5">
            <span className="text-2xl font-bold text-emerald-400 font-display">{completed}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 relative">
        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Progress</span>
          <span className="text-emerald-400 font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-950/50 rounded-full h-3 p-[2px] border border-white/5 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
}
