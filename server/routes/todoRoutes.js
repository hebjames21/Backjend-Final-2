const express = require('express');
const Todo = require('../models/todo');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

console.log('Initializing Todo routes');

router.post('/', authMiddleware, (req, res) => {
  console.log('Create todo endpoint hit');
  const { title, description } = req.body;

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

router.get('/', authMiddleware, (req, res) => {
  console.log('Get todos endpoint hit');

  Todo.find({ user: req.userId })
    .then(todos => {
      console.log(`Retrieved ${todos.length} todos for user ${req.userId}`);
      res.json({ message: 'Todos retrieved successfully', todos });
    })
    .catch(error => {
      console.error('Error fetching todos:', error);
      res.status(500).json({ message: 'Error fetching todos', error });
    });
});

router.get('/:id', authMiddleware, (req, res) => {
  console.log(`Get todo endpoint hit for ID: ${req.params.id}`);

  Todo.findById(req.params.id)
    .then(todo => {
      if (!todo) {
        console.log(`Todo not found with ID: ${req.params.id}`);
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (todo.user.toString() !== req.userId) {
        console.log(`Unauthorized access to todo ${req.params.id} by user ${req.userId}`);
        return res.status(403).json({ message: 'Not authorized to access this todo' });
      }

      console.log(`Todo ${req.params.id} retrieved successfully`);
      res.json({ message: 'Todo retrieved successfully', todo });
    })
    .catch(error => {
      console.error(`Error fetching todo ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error fetching todo', error });
    });
});

router.put('/:id', authMiddleware, (req, res) => {
  console.log(`Update todo endpoint hit for ID: ${req.params.id}`);
  const { title, description, completed } = req.body;

  Todo.findById(req.params.id)
    .then(todo => {
      if (!todo) {
        console.log(`Todo not found with ID: ${req.params.id}`);
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (todo.user.toString() !== req.userId) {
        console.log(`Unauthorized update attempt for todo ${req.params.id} by user ${req.userId}`);
        return res.status(403).json({ message: 'Not authorized to update this todo' });
      }

      todo.title = title;
      todo.description = description;
      todo.completed = completed;

      return todo.save();
    })
    .then(updatedTodo => {
      if (!updatedTodo) return;

      console.log(`Todo ${req.params.id} updated successfully`);
      res.json({ message: 'Todo updated successfully', todo: updatedTodo });
    })
    .catch(error => {
      console.error(`Error updating todo ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error updating todo', error });
    });
});

router.delete('/:id', authMiddleware, (req, res) => {
  console.log(`Delete todo endpoint hit for ID: ${req.params.id}`);

  Todo.findById(req.params.id)
    .then(todo => {
      if (!todo) {
        console.log(`Todo not found with ID: ${req.params.id}`);
        return res.status(404).json({ message: 'Todo not found' });
      }

      if (todo.user.toString() !== req.userId) {
        console.log(`Unauthorized delete attempt for todo ${req.params.id} by user ${req.userId}`);
        return res.status(403).json({ message: 'Not authorized to delete this todo' });
      }

      return Todo.findByIdAndDelete(req.params.id);
    })
    .then(result => {
      if (!result) return;

      console.log(`Todo ${req.params.id} deleted successfully`);
      res.json({ message: 'Todo deleted successfully' });
    })
    .catch(error => {
      console.error(`Error deleting todo ${req.params.id}:`, error);
      res.status(500).json({ message: 'Error deleting todo', error });
    });
});

module.exports = router;