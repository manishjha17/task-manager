const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, reorderTasks } = require('../controllers/taskController');

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/reorder')
  .put(reorderTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
