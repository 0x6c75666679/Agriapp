const router = require('express').Router();
const { verify } = require('jsonwebtoken');
const userController = require('../controller/userController');
const middleware = require('../middleware/jwtVerify')

router.post('/register' , userController.register)
router.post('/login' , userController.login)
router.delete('/delete' , middleware.verify , userController.deleteUser)
router.put('/update' , middleware.verify , userController.updateUser)
router.put('/changePassoword' , middleware.verify, userController.updatePassword)
module.exports = router;