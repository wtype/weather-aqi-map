const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (req, res) => {
  database.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

app.post('/api', (req, res) => {
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  res.json(data);
});

app.get('/weather/:latlon', async (req, res) => {
  const [lat, lon] = req.params.latlon.split(',');

  const WEATHER_URL = `https://api.darksky.net/forecast/${process.env.DARKSKY}/${lat},${lon}/?units=si`;
  const wResponse = await fetch(WEATHER_URL);
  const wData = await wResponse.json();

  const AIR_URL = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aResponse = await fetch(AIR_URL);
  const aData = await aResponse.json();

  const data = {
    weather: wData,
    air: aData,
  };

  res.json(data);
});

const PORT = process.env.PORT || 9090;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
