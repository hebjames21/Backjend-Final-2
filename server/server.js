const express = require('express')
const mongoose = require ('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to backendfinal database');
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });

app.use('/api/auth', authRoutes);

app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('Backend API is successfully running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server can be accessed at http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});