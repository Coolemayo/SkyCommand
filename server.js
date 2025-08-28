import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import bodyParser from "body-parser";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Setup
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/discord/callback`,
      scope: ["identify"],
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

// Login routes
app.get("/auth/discord", passport.authenticate("discord"));
app.get(
  "/auth/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// Middleware: Auth Check
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

// Multer for screenshot uploads
const upload = multer({ dest: "uploads/" });

// API ROUTES
app.get("/api/stats", checkAuth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.pfconnect.online/api/v1/flights/stats?api_key=${process.env.PFCONNECT_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.get("/api/flights", checkAuth, async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.pfconnect.online/api/v1/flights/recent?api_key=${process.env.PFCONNECT_API_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch flights" });
  }
});

app.post("/api/log", checkAuth, upload.single("screenshot"), async (req, res) => {
  try {
    const { callsign, aircraft, departure, arrival, altitude, remarks } = req.body;
    // Placeholder for upload logic to PFConnect
    res.json({ success: true, message: "Flight logged successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to log flight" });
  }
});

// Pages
app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.sendFile(process.cwd() + "/public/login.html");
  }
});
app.get("/dashboard", checkAuth, (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));