import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Beispiel: Proxy für Flight Logging
app.post("/api/log", async (req, res) => {
  try {
    const response = await fetch("https://api.pfconnect.online/api/v1/flights", {
      method: "POST",
      headers: {
        "Authorization": `Bearer $pfc_6996f46fd6119d2c6086c85bb6fab77c`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to log flight" });
  }
});

// Beispiel: Hole Statistiken
app.get("/api/stats", async (req, res) => {
  try {
    const response = await fetch("https://api.pfconnect.online/api/v1/stats", {
      headers: {
        "Authorization": `Bearer $pfc_6996f46fd6119d2c6086c85bb6fab77c`
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));