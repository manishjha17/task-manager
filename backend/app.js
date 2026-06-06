require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/tasks', taskRoutes);

//Route Checking
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API is healthy and running',
    timestamp: new Date()
  });
});

//Root Route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Task Manager API' });
});

module.exports = app;
