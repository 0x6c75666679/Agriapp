const router = require('express').Router();
const { verify } = require('../middleware/jwtVerify');
const fieldController = require('../controller/fieldController');

router.post('/create-field', verify, fieldController.createField);
router.get('/get-fields', verify, fieldController.getFields);

module.exports = router; 