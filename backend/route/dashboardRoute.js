const router = require('express').Router();
const { useWeather } = require('../thridpartyapi/weather');

router.get('/weather', (req, res) => {
    const { weather, weatherNote, loading, error } = useWeather();
    res.json({ weather, weatherNote, loading, error });
});

module.exports = router;