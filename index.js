const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors=require("cors");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({//* represent all website to call 
    origin: '*'
}));


app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = await getWeatherData(cities);
    res.json({ weather: weatherData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getWeatherData(cities) {
  const weatherData = {};

  const requests = cities.map(async (city) => {
    try {
      const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=01fcb70ec8d140439ee51706230908&q=${city}&aqi=no`);
      const temperature = response.data.current.temp_c;
      weatherData[city] = `${temperature}C`;
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error.message);
      weatherData[city] = 'N/A'; // Set temperature to 'N/A' in case of an error
    }
  });

  await Promise.all(requests);

  return weatherData;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
