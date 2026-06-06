import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import './App.css'; // kept in case you have custom standard resets

// Fallback to local API port 5000, configurable for deployment
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

  // Fetch tasks from Express API
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

  // Re-fetch when filters or search change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks();
    }, 300); // 300ms debounce to prevent spamming Atlas database on keystrokes

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
  const handleDeleteTask = async (id) => {
    try{
      setError(null);
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const resData = await response.json();
      if(!response.ok){
        throw new Error(resData.message || 'Failed to delete task');
      }
      setTasks(prev => prev.filter(t => t._id !== id));
      setTaskToDelete(null);
    }catch(err){
      setError(err.message);
    }
  };

  // Reorder tasks (Drag and Drop state persistence)
  const handleReorderTasks = async (newOrderedTasks) => {
    const originalTasks = [...tasks];
    // Optimistic UI update for fluid animations
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
      setTasks(originalTasks); // rollback on error
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col gap-6">
      {/* Visual Header */}
      <Header tasks={tasks} />

      {/* Error Alert Bar */}
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

      {/* Main Content Layout Container */}
      <main className="flex-1 flex flex-col gap-6">
        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-semibold tracking-wide">Loading tasks from ZenTask database...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="text-center py-10 glass-panel rounded-2xl">
              <p className="text-slate-400 font-medium">Layout framework initialized successfully.</p>
              <p className="text-xs text-slate-500 mt-2">Core API hooks and status headers are ready for Milestone 6.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
