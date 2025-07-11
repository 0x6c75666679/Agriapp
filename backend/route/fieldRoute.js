const router = require('express').Router();
const { verify } = require('../middleware/jwtVerify');
const fieldController = require('../controller/fieldController');

router.post('/create-field', verify, fieldController.createField);
router.get('/get-fields', verify, fieldController.getFields);
router.post('/update-field-status', verify, fieldController.updateFieldStatus);
router.delete('/delete-all-fields', verify, fieldController.deleteAllFields);
router.put('/update-field', verify, fieldController.updateField);
router.post('/delete-field', verify, fieldController.deleteField);

module.exports = router; 