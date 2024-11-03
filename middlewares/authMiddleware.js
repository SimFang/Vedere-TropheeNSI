// middlewares/authMiddleware.js
const { auth } = require('../config/firebase');

const authenticate = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).send('Access denied. No token provided.');
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken; // Attach user info to request
        next();
    } catch (error) {
        res.status(401).send('Invalid token.');
    }
};

module.exports = authenticate; // Ensure you export the middleware function correctly
