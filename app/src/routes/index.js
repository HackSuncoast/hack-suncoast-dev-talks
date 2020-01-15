const express = require('express');
const router = express.Router();
const rp = require('request-promise');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/weather', async (req, res) => {
  const zipCode = req.query.zipCode;
  let temp = 0;

  res.status(200).json({ code: 200, temp });
});

const getWeatherFromOpenWeatherAPI = zipCode => {
  return rp({
    url: `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&APPID=a189e592c979e3217ffa8d3b90a202f9`,
    method: 'GET',
    json: true
  }).then(results => {
    return kelvinToFahrenheit(results.main.temp);
  });
};

const kelvinToFahrenheit = kelvin => {
  return (kelvin - 273.15) * (9 / 5) + 32;
};

router.post('/user/register', (req, res) => {
  const { userName, firstName, lastName, age } = req.body;

  console.log(`Saving ${userName}: ${firstName} ${lastName} to the database!`);
  res.json({
    code: 200,
    message: `Successfully saved ${userName} to the database!`
  });
});

module.exports = router;
