const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    console.log('Auth middleware hit');

    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Access denied. No token provided.' 
       });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verification successful for user:', decoded.id);

        req.userID = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;