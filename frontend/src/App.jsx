import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import ConfirmModal from './components/ConfirmModal';
import EmptyState from './components/EmptyState';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try{
      setLoading(true);
      setError(null);
      const url = new URL(API_BASE);
      if(statusFilter !== 'all') url.searchParams.append('status', statusFilter);
      if(searchQuery.trim()) url.searchParams.append('search', searchQuery.trim());
      const response = await fetch(url);
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to fetch tasks');
      }
      setTasks(resData.data || []);
    }catch(err){
      setError(err.message || 'Unable to connect to the server');
    }finally{
      setLoading(false);
    }
  };

  // Debounced fetch on filter/search change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [statusFilter, searchQuery]);

  // Create task
  const handleCreateTask = async (taskData) => {
    try{
      setError(null);
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to create task');
      }
      setTasks(prev => [resData.data, ...prev]);
      setIsFormOpen(false);
    }catch(err){
      setError(err.message);
    }
  };

  // Update task details
  const handleUpdateTask = async (id, taskData) => {
    try{
      setError(null);
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to update task');
      }
      setTasks(prev => prev.map(t => t._id === id ? resData.data : t));
      setEditingTask(null);
      setIsFormOpen(false);
    }catch(err){
      setError(err.message);
    }
  };

  // Toggle completion status
  const handleToggleComplete = async (id, completed) => {
    try{
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to toggle status');
      }
      setTasks(prev => prev.map(t => t._id === id ? resData.data : t));
    }catch(err){
      setError(err.message);
    }
  };

  // Delete task
  const handleDeleteTask = async () => {
    if(!taskToDelete) return;
    try{
      setError(null);
      const response = await fetch(`${API_BASE}/${taskToDelete._id}`, { method: 'DELETE' });
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to delete task');
      }
      setTasks(prev => prev.filter(t => t._id !== taskToDelete._id));
      setTaskToDelete(null);
    }catch(err){
      setError(err.message);
    }
  };

  // Reorder tasks (Drag and Drop state persistence)
  const handleReorderTasks = async (newOrderedTasks) => {
    const originalTasks = [...tasks];
    setTasks(newOrderedTasks);
    try{
      const taskIds = newOrderedTasks.map(t => t._id);
      const response = await fetch(`${API_BASE}/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds })
      });
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to save reorder');
      }
    }catch(err){
      setError(err.message);
      setTasks(originalTasks);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if(draggedIndex === null || draggedIndex === index) return;
    const tempTasks = [...tasks];
    const draggedItem = tempTasks[draggedIndex];
    tempTasks.splice(draggedIndex, 1);
    tempTasks.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setTasks(tempTasks);
  };

  const handleDragEnd = () => {
    if(draggedIndex === null) return;
    handleReorderTasks(tasks);
    setDraggedIndex(null);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col gap-6">
      <Header tasks={tasks} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl flex justify-between items-center text-sm shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200 transition-colors font-bold px-2 py-1">
            ✕
          </button>
        </div>
      )}

      {/* Control Panel (Search, Filters, Create trigger) */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-full"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                statusFilter === f
                  ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-md shadow-yellow-500/5'
                  : 'border-white/5 bg-slate-900/25 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => {
            setEditingTask(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Task
        </button>
      </div>

      {/* Expandable Task Editor/Creator Form */}
      {(isFormOpen || editingTask) && (
        <div className="animate-fadeIn">
          <TaskForm
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
            initialTask={editingTask}
          />
        </div>
      )}

      {/* Task List container */}
      <main className="flex-1 flex flex-col gap-4">
        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-semibold tracking-wide">Loading tasks from database...</p>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            statusFilter={statusFilter}
            searchQuery={searchQuery}
            onClear={handleClearFilters}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task, idx) => (
              <TaskItem
                key={task._id}
                task={task}
                index={idx}
                onToggleComplete={handleToggleComplete}
                onEdit={(t) => {
                  setIsFormOpen(false);
                  setEditingTask(t);
                }}
                onDeleteClick={(t) => setTaskToDelete(t)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Overlay Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        taskTitle={taskToDelete ? taskToDelete.title : ''}
        onConfirm={handleDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}
