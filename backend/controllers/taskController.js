const Task = require('../models/Task');

// Get all tasks (with optional filters for status and search)
const getTasks = async (req, res) => {
  try{
    const { status, search } = req.query;
    const query = {};
    // status filter
    if(status === 'active') {
      query.completed = false;
    } else if (status === 'completed') {
      query.completed = true;
    }
    // search filter
    if(search) {
      query.title = { $regex: search, $options: 'i' };
    }
    // custom order first, then newest
    const tasks = await Task.find(query).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Server Error: unable to fetch tasks',
      error: error.message
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try{
    const { title, description, dueDate, priority } = req.body;
    if(!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Title is required'
      });
    }
    // new tasks start at the top of the list
    const minOrderTask = await Task.findOne().sort({ order: 1 });
    const newOrder = minOrderTask ? minOrderTask.order - 1 : 0;
    const task = await Task.create({
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || 'medium',
      order: newOrder
    });
    res.status(201).json({
      success: true,
      data: task
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Server Error: unable to create task',
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try{
    const { id } = req.params;
    const { title, description, dueDate, completed, priority } = req.body;
    let task = await Task.findById(id);
    if(!task){
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    if(title !== undefined) task.title = title;
    if(description !== undefined) task.description = description;
    if(dueDate !== undefined) task.dueDate = dueDate;
    if(completed !== undefined) task.completed = completed;
    if(priority !== undefined) task.priority = priority;
    await task.save();
    res.status(200).json({
      success: true,
      data: task
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Server Error: unable to update task',
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try{
    const { id } = req.params;
    const task = await Task.findById(id);
    if(!task){
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    await task.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Server Error: unable to delete task',
      error: error.message
    });
  }
};

const reorderTasks = async (req, res) => {
  try{
    const { taskIds } = req.body;
    if(!taskIds || !Array.isArray(taskIds)){
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID list'
      });
    }
    const bulkOps = taskIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    }));
    await Task.bulkWrite(bulkOps);
    res.status(200).json({
      success: true,
      message: 'Tasks reordered successfully'
    });
  }catch(error){
    res.status(500).json({
      success: false,
      message: 'Server Error: unable to reorder tasks',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
};
