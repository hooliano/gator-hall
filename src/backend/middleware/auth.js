const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        // Verify token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided.' });
        }

        // Fetch auth token for attempt
        const auth_token = authHeader.split(' ')[1];

        const decoded_payload = jwt.verify(auth_token, process.env.JWT_SECRET);
        req.user = decoded_payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token invalid/expired.' });
    }
}

module.exports = authMiddleware