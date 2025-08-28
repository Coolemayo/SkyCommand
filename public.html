import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Discord Strategy
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/discord/callback`,
  scope: ["identify"]
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

// Auth Middleware
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login.html");
}

// Auth Routes
app.get("/auth/discord", passport.authenticate("discord"));
app.get("/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/login.html" }),
  (req, res) => res.redirect("/dashboard")
);
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/login.html"));
});

// Static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for screenshots
const upload = multer({ dest: "uploads/" });

// API Endpoints
app.post("/api/log", checkAuth, upload.single("screenshot"), async (req, res) => {
  try {
    const { callsign, aircraft, departure, arrival, altitude, remarks } = req.body;
    const response = await axios.post(
      "https://api.pfconnect.online/api/v1/flights",
      { callsign, aircraft, departure, arrival, altitude, remarks },
      { headers: { Authorization: `Bearer ${process.env.PFCONNECT_API_KEY}` } }
    );
    res.json({ success: true, message: "Flight logged!", data: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log flight" });
  }
});

app.get("/api/stats", checkAuth, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.pfconnect.online/api/v1/flights/stats",
      { headers: { Authorization: `Bearer ${process.env.PFCONNECT_API_KEY}` } }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/flights", checkAuth, async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.pfconnect.online/api/v1/flights/recent",
      { headers: { Authorization: `Bearer ${process.env.PFCONNECT_API_KEY}` } }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

// Pages
app.get("/", (req, res) => res.redirect("/login.html"));
app.get("/dashboard", checkAuth, (req, res) => res.sendFile(path.join(process.cwd(), "public/index.html")));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));