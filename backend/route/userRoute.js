const router = require('express').Router();
const userController = require('../controller/userController');
const userFeatures = require('../controller/userfeatures');
const { verify, verifyAdmin } = require('../middleware/jwtVerify');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/get-users', verifyAdmin, userController.getUsers);

// Protected routes (require JWT token)
router.delete('/delete', verify, userController.deleteUser);
router.put('/update', verify, userController.updateUser);
router.get('/profile', verify, userController.getUserProfile);
router.put('/changePassword', verify, userController.updatePassword);

// Dashboard route (requires JWT token)
router.get('/dashboard', verify, userFeatures.Dashboard);

module.exports = router;