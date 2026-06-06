import React, { useState } from 'react';
import { cn } from '../utils';

export default function TaskItem({
  task,
  index,
  onToggleComplete,
  onEdit,
  onDeleteClick,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverdue = task.dueDate && new Date(task.dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) && !task.completed;

  const formatDate = (dateStr) => {
    if(!dateStr) return '';
    const date = new Date(dateStr);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const priorityStyles = {
    low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop && onDrop(e, index)}
      className={cn(
        "glass-card p-4 rounded-xl flex items-center justify-between gap-4 border cursor-grab active:cursor-grabbing select-none relative group",
        task.completed ? "opacity-60" : "",
        isOverdue ? "border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.1)]" : "border-white/5"
      )}
    >
      {isOverdue && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl"></div>
      )}

      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
          </svg>
        </div>

        <button
          type="button"
          onClick={() => onToggleComplete(task._id, task.completed)}
          className={cn(
            "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer",
            task.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : isOverdue
                ? "border-red-500/50 hover:border-red-400"
                : "border-slate-500 hover:border-yellow-400"
          )}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col min-w-0 flex-1 cursor-pointer"
          title="Click to expand/collapse description"
        >
          <span
            className={cn(
              "text-sm font-semibold tracking-wide truncate transition-all",
              task.completed ? "line-through text-slate-500" : "text-slate-200"
            )}
          >
            {task.title}
          </span>
          {task.description && (
            <p
              className={cn(
                "text-xs text-slate-400 mt-1 transition-all duration-300",
                isExpanded
                  ? "whitespace-pre-wrap break-words"
                  : "truncate max-w-[200px] sm:max-w-md"
              )}
            >
              {task.description}
            </p>
          )}
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5 select-none">
            Created {formatDate(task.createdAt || new Date())}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {task.dueDate && !task.completed && (
          <div className="hidden sm:flex flex-col items-end text-right">
            {isOverdue ? (
              <span className="flex items-center gap-1 text-red-400 font-bold px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-xs">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Overdue
              </span>
            ) : (
              <>
                <span className="text-slate-300 text-xs font-semibold">
                  {formatDate(task.dueDate)}
                </span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 select-none">
                  Due
                </span>
              </>
            )}
          </div>
        )}

        {!task.completed && (
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border",
              priorityStyles[task.priority]
            )}
          >
            {task.priority}
          </span>
        )}

        <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-yellow-400 hover:bg-slate-800/40 transition-all cursor-pointer"
            title="Edit Task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDeleteClick(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800/40 transition-all cursor-pointer"
            title="Delete Task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
