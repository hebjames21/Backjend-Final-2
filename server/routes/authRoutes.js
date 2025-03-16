const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();

console.log('Initializing routes');

router.post('/register', (req, res) => {
  console.log('Register endpoint hit');
  const { username, email, password } = req.body;

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        console.log('Registration failed: User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = new User({ username, email, password });
      return newUser.save();
    })
    .then(savedUser => {
      console.log(`User registered successfully: ${savedUser.username}`);
      res.status(201).json({ message: 'User registered successfully!', user: savedUser });
    })
    .catch(error => {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user', error });
    });
});


router.post('/login', (req, res) => {
  console.log('Login endpoint hit');
  const { email, password } = req.body;


  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log('Login failed: User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      return user.comparePassword(password)
        .then(isMatch => {
          if (!isMatch) {
            console.log('Login failed: Incorrect password');
            return res.status(401).json({ message: 'Incorrect password' });
          }

          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          console.log(`User logged in successfully: ${user.username}`);
          res.status(200).json({ message: 'Login successful', token, user });
        });
    })
    .catch(error => {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in', error });
    });
});

module.exports = router;