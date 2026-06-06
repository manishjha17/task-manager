import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, onCancel, initialTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      if (initialTask.dueDate) {
        setDueDate(new Date(initialTask.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setValidationError('');
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      priority
    });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl flex flex-col gap-4 shadow-xl border border-white/5 animate-fadeIn">
      <h2 className="text-xl font-bold font-display text-white select-none">
        {initialTask ? 'Edit Task' : 'Create New Task'}
      </h2>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setValidationError('');
          }}
          placeholder="What needs to be done?"
          maxLength={100}
          className="glass-input px-4 py-2.5 rounded-xl text-sm w-full"
        />
        {validationError && (
          <span className="text-xs text-red-400 font-medium">{validationError}</span>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task..."
          rows={3}
          className="glass-input px-4 py-2.5 rounded-xl text-sm w-full resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Due Date */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="glass-input px-4 py-2.5 rounded-xl text-sm w-full"
          />
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((p) => {
              const isActive = priority === p;
              let activeColorClass = '';
              if (isActive) {
                if (p === 'low') activeColorClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                if (p === 'medium') activeColorClass = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
                if (p === 'high') activeColorClass = 'bg-red-500/20 text-red-300 border-red-500/40';
              }
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${isActive
                      ? `${activeColorClass} shadow-md`
                      : 'border-white/5 bg-slate-900/25 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 transition-all font-bold"
        >
          {initialTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
