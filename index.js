const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

// let  tasks = require('./tasks');

let  tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 }
];
const app = express();

app.use(cors());

const port = 3000;


app.use(express.static('static'));

//API Endpoint 1 :Add Task a list 



app.get('/tasks/add', (req, res) => {
  const { taskId, text, priority } = req.query;

  // Check if all parameters are provided
  if (!taskId || !text || !priority) {
      return res.status(400).json({ error: 'Missing taskId, text or priority in the query parameters.' });
  }

  // Add the new task to the tasks array
  const newTask = {
      taskId: parseInt(taskId),
      text: text,
      priority: parseInt(priority)
  };
  tasks.push(newTask);

  // Respond with the updated task list
  res.json({ tasks });
});



//API Endpoint 2-Read all the task 

app.get('/tasks', (req, res) => {
  // Return the current list of tasks
  res.json({ tasks });
});


//API Endpoint 3- Sort by Priority


app.get('/tasks/sort-by-priority', (req, res) => {
  // Sort tasks by priority in ascending order
  let sortedTasks = [...tasks].sort((a, b) => a.priority - b.priority);
  
  // Return the sorted list
  res.json({ tasks: sortedTasks });
});


//API Endpoint 4 -Edit the Task Priority

app.get('/tasks/edit-priority', (req, res) => {
  // Extract query parameters
  const taskId = parseInt(req.query.taskId);
  const newPriority = parseInt(req.query.priority);

  // Check if both taskId and priority are provided
  if (!taskId || !newPriority) {
      return res.status(400).json({ error: 'taskId and priority are required.' });
  }

  // Find the task by taskId
  const taskIndex = tasks.findIndex(task => task.taskId === taskId);

  if (taskIndex !== -1) {
      // Update the task's priority
      tasks[taskIndex].priority = newPriority;
      return res.json({ tasks });
  } else {
      // If task is not found, return an error
      return res.status(404).json({ error: 'Task not found.' });
  }
});


//API Endpoint 5 - Edit Update Task 

app.get('/tasks/edit-text', (req, res) => {
  // Extract query parameters
  const taskId = parseInt(req.query.taskId);
  const newText = req.query.text;

  // Check if both taskId and newText are provided
  if (!taskId || !newText) {
      return res.status(400).json({ error: 'taskId and text are required.' });
  }

  // Find the task by taskId
  const taskIndex = tasks.findIndex(task => task.taskId === taskId);

  if (taskIndex !== -1) {
      // Update the task's text
      tasks[taskIndex].text = newText;
      return res.json({ tasks });
  } else {
      // If task is not found, return an error
      return res.status(404).json({ error: 'Task not found.' });
  }
});



//API Endpoint -6 -Delee Task for the list

app.get('/tasks/delete', (req, res) => {
  // Extract taskId from query parameters
  const taskId = parseInt(req.query.taskId);

  // Check if taskId is provided
  if (!taskId) {
      return res.status(400).json({ error: 'taskId is required.' });
  }

  // Filter out the task with the provided taskId
  const initialTaskCount = tasks.length;
  tasks = tasks.filter(task => task.taskId !== taskId);

  // Check if a task was actually deleted
  if (tasks.length === initialTaskCount) {
      return res.status(404).json({ error: 'Task not found.' });
  }

  // Return the updated task list
  return res.json({ tasks });
});


//API Endpoint 7 - Filter Task by Priority

app.get('/tasks/filter-by-priority', (req, res) => {
  // Extract priority from query parameters and parse it as an integer
  const priority = parseInt(req.query.priority);

  // Check if priority is provided and is a valid number
  if (isNaN(priority)) {
      return res.status(400).json({ error: 'A valid priority is required.' });
  }

  // Filter tasks based on the provided priority
  const filteredTasks = tasks.filter(task => task.priority === priority);

  // Return the filtered tasks
  return res.json({ tasks: filteredTasks });
});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
