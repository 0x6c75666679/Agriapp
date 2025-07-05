const router = require('express').Router();
const { verify } = require('../middleware/jwtVerify');
const taskController = require('../controller/taskMangment');
const fieldController = require('../controller/fieldController');

// Weather routes (protected with JWT)
router.post('/create-task', verify, taskController.createTask);
router.get('/get-tasks', verify, taskController.getTasks);
router.put('/update-task', verify, taskController.updateTask);
router.put('/status-update', verify, taskController.statusUpdate);
router.post('/delete-task', verify, taskController.deleteTask);
router.delete('/delete-all-tasks', verify, taskController.deleteAllTasks);

module.exports = router; 