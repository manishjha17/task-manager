import React from 'react';

export default function Header({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  // Calculate HSL hue dynamically: 0 = red, 60 = yellow, 120 = green
  const hue = (percentage / 100) * 120;
  
  const textStyle = {
    color: `hsl(${hue}, 85%, 55%)`
  };

  const barStyle = {
    width: `${percentage}%`,
    backgroundColor: `hsl(${hue}, 85%, 50%)`,
    boxShadow: `0 0 10px hsl(${hue}, 85%, 50%, 0.4)`
  };

  return (
    <header className="glass-panel p-6 rounded-2xl mb-6 shadow-xl relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl translate-x-10 translate-y-10"></div>

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent m-0 select-none">
            ZenTask
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-medium tracking-wide">
            Your personal productivity space
          </p>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center glass-card px-4 py-2 rounded-xl min-w-24 border border-white/5">
            <span className="text-2xl font-bold text-yellow-400 font-display">{active}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active</span>
          </div>

          <div className="flex flex-col items-center glass-card px-4 py-2 rounded-xl min-w-24 border border-white/5">
            <span className="text-2xl font-bold text-amber-500 font-display">{completed}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 relative">
        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Progress</span>
          <span style={textStyle} className="font-bold transition-all duration-500">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-950/50 rounded-full h-3 p-[2px] border border-white/5 shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={barStyle}
          ></div>
        </div>
      </div>
    </header>
  );
}
