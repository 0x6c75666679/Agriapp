const { request } = require('express');
const { v4: uuidv4 } = require('uuid');
const User = require('../model/user');
const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require('jsonwebtoken');

const Dashboard = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Verify the user exists in database (optional extra security)
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check role from JWT token
        if (req.user.role === "user") {
            res.status(200).json({ 
                message: "Welcome to the user dashboard",
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }
            });
        } else if (req.user.role === "admin") {
            res.status(200).json({ 
                message: "Welcome to the admin dashboard",
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role
                }
            });
        } else {
            res.status(403).json({ message: "You are not authorized to access this page" });
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    Dashboard
}
