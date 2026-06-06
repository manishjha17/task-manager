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

module.exports = {
  getTasks,
  createTask
};
