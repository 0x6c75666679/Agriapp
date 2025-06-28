const router = require('express').Router();
const userController = require('../controller/userController');
const userFeatures = require('../controller/userfeatures');
const { verify, verifyAdmin } = require('../middleware/jwtVerify');
const { uploadProfilePicture } = require('../middleware/multer');
const path = require('path');
const fs = require('fs');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require JWT token)
router.delete('/delete', verify, userController.deleteUser);
router.put('/update', verify, userController.updateUser);
router.get('/profile', verify, userController.getUserProfile);
router.post('/uploadProfilePicture', verify, uploadProfilePicture, userController.uploadProfilePicture);
router.put('/changePassword', verify, userController.updatePassword);

// Route to serve uploaded images
router.get('/uploads/:userFolder/:type/:filename', (req, res) => {
    const { userFolder, type, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', userFolder, type, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Image not found' });
    }
    
    // Serve the file
    res.sendFile(filePath);
});

// Dashboard route (requires JWT token)
router.get('/dashboard', verify, userFeatures.Dashboard);

// Admin-only routes (require JWT token + admin role)
router.get('/admin/dashboard', verifyAdmin, (req, res) => {
    res.status(200).json({ 
        message: "Admin dashboard - you have admin privileges",
        user: req.user
    });
});

module.exports = router;