const router = require('express').Router();
const weatherController = require('../controller/weatherController');
const { verify } = require('../middleware/jwtVerify');

// Weather routes (protected with JWT)
router.get('/current', weatherController.getCurrentWeather);
router.get('/forecast', weatherController.getWeatherForecast);
router.get('/data', weatherController.getWeatherData);
router.post('/generate-note', weatherController.generateWeatherNote);

module.exports = router; 