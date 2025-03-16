const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  

  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        console.log(`Registration failed: Email ${email} already exists`);
        return res.status(400).json({ message: 'User already exists' });
      }
      

      const newUser = new User({
        username,
        email,
        password
      });
      
      console.log(`Creating new user with email: ${email}`);
      return newUser.save();
    })
    .then(newUser => {
      if (!newUser) return;
      
      console.log(`User created successfully: ${newUser._id}`);
      

      const token = jwt.sign(
        { id: newUser._id }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.status(201).json({
        message: 'User registered successfully',
        token,
        userId: newUser._id
      });
    })
    .catch(error => {
      console.error('Registration error:', error.message);
      res.status(500).json({ message: 'Server error during registration' });
    });
};


exports.login = (req, res) => {
  const { email, password } = req.body;
  let userData;
  

  User.findOne({ email })
    .then(user => {
      if (!user) {
        console.log(`Login failed: No user found with email ${email}`);
        throw new Error('Invalid credentials');
      }
      
      userData = user;
      

      console.log(`Comparing passwords for user: ${user._id}`);
      return user.comparePassword(password);
    })
    .then(isMatch => {
      if (!isMatch) {
        console.log(`Login failed: Invalid password for user ${userData._id}`);
        throw new Error('Invalid credentials');
      }
      

      const token = jwt.sign(
        { id: userData._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      console.log(`User logged in successfully: ${userData._id}`);
      res.json({
        message: 'Login successful',
        token,
        userId: userData._id
      });
    })
    .catch(error => {
      if (error.message === 'Invalid credentials') {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Server error during login' });
    });
};