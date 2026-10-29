const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token explicitly says they are an admin
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'Forbidden. Admin access required.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Admin token verification error:', error);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { verifyAdmin };