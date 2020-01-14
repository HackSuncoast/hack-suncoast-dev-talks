const express = require('express');
const router = express.Router();
const rp = require('request-promise');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/weather', async (req, res) => {
  const zipCode = req.query.zipCode;

  if (!zipCode) {
    res
      .status(400)
      .json({
        code: 400,
        error: 'Required query parameter zip code not found'
      });
  }

  if (zipCode.length !== 5) {
    res
      .status(400)
      .json({ code: 400, error: 'The zip code must be 5 numbers long!' });
  }

  // Mocking a database
  // Rather than making an API call every time, we save results per zip code on each request to cache it and prevent subsequent API calls
  let temp;
  switch (zipCode) {
    case '33480':
      temp = 45;
      break;
    case '08854':
      temp = 48;
      break;
    default:
      temp = await getWeatherFromOpenWeatherAPI(req.query.zipCode).catch(
        err => {
          return res.status(400).json({
            code: 400,
            error: `The city indicated by ${zipCode} has not been found!`
          });
        }
      );
      break;
  }
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
  if (
    userName === undefined ||
    firstName === undefined ||
    lastName === undefined ||
    age === undefined
  ) {
    res
      .status(400)
      .json({ code: 400, error: 'Please fill in all the required fields!' });
  }

  if (age < 18) {
    res.status(400).json({
      code: 400,
      error: 'Sorry, you must be 18 or older in order to use this app!'
    });
  }

  console.log(`Saving ${userName}: ${firstName} ${lastName} to the database!`);
  res.json({
    code: 200,
    message: `Successfully saved ${userName} to the database!`
  });
});

module.exports = router;
