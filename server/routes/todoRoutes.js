const express = require('express');
const Todo = require('../models/todo');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

console.log('Initializing Todo routes');

router.post('/', authMiddleware, (req, res) => {
  console.log('Create todo endpoint hit');
  const { title, description } = req.body;

if (!req.userId) {
    console.log('User ID not found in request');
    return res.status(400).json({ message: 'User ID is required' });
}

  const newTodo = new Todo({
    title,
    description,
    user: req.userId,
  });

  newTodo.save()
    .then(todo => {
      console.log('Todo created successfully:', todo.title);
      res.status(201).json({ message: 'Todo created successfully', todo });
    })
    .catch(error => {
      console.error('Error creating todo:', error);
      res.status(500).json({ message: 'Error creating todo', error });
    });
});

module.exports = router;