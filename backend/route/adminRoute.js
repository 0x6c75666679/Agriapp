const router = require('express').Router();
const userController = require('../controller/userController');
const { verifyAdmin } = require('../middleware/jwtVerify');

// Admin dashboard
router.get('/dashboard', verifyAdmin, (req, res) => {
    res.status(200).json({ 
        message: "Admin dashboard - you have admin privileges",
        user: req.user
    });
});

// Admin user management
router.get('/users', verifyAdmin, userController.getAllUsers);
router.put('/users/:userId/role', verifyAdmin, userController.updateUserRole);
router.delete('/users/:userId', verifyAdmin, userController.deleteUserAdmin);

module.exports = router; 