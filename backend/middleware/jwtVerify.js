const jwt = require('jsonwebtoken');
const User = require('../model/user');
require('dotenv').config()

const verify = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('🔍 JWT Debug:');
    console.log('Auth header:', authHeader);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Authorization header missing or invalid format. Use 'Bearer <token>'" });
    }

    try {
        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(403).json({ message: "Token not provided" });
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT);
        console.log('Decoded token:', decoded);
        
        // Check if user exists and get current token version
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Check if token version matches (for token invalidation)
        if (decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({ message: "Token has been invalidated. Please log in again." });
        }
        
        // Add user info to request object
        req.user = { 
            id: decoded.id, 
            email: decoded.email,
            role: decoded.role 
        };
        
        console.log('✅ JWT verified, calling next()');
        return next();

    } catch (err) {
        console.error('JWT verification error:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Middleware to check if user is admin
const verifyAdmin = async (req, res, next) => {
    console.log("verifyAdmin")
    try {
        // First verify the JWT token
        await verify(req, res, (err) => {
            if (err) return next(err);
        });

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        return next();
    } catch (error) {
        console.error('Admin verification error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    verify,
    verifyAdmin
}