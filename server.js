const express = require('express');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Multer für Screenshot Upload
const upload = multer({ dest: 'uploads/' });

// Flight Logging Route
app.post('/api/log', upload.single('screenshot'), async (req, res) => {
  try {
    const { callsign, aircraft, from, to, altitude, remarks } = req.body;
    // Datei liegt in req.file
    // Hier kann man direkt an PFConnect senden oder lokal speichern
    const response = await axios.post('https://api.pfconnect.online/api/v1/flights', {
      callsign, aircraft, from, to, altitude, remarks
    }, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });

    res.json({ success: true, message: "Flight logged!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to log flight" });
  }
});

// Stats Route
app.get('/api/stats', async (req, res) => {
  try {
    const response = await axios.get('https://api.pfconnect.online/api/v1/stats', {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Charts Route
app.get('/api/charts', async (req, res) => {
  const icao = req.query.icao;
  if (!icao) return res.status(400).json({ error: "ICAO required" });

  try {
    const response = await axios.get(`https://api.pfconnect.online/api/v1/charts/uploads?icao=${icao}`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch charts" });
  }
});

// Discord Login placeholder
app.get('/auth/discord', (req, res) => {
  res.send("Discord login redirect placeholder");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));