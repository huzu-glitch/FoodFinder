import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;
const apiKey = process.env.API_KEY;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    return console.error("Could not connect to the database", err);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware to check authentication
function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}

// API ROUTES

// Check authentication status
app.get("/api/auth/status", (req, res) => {
  if (req.session && req.session.userId) {
    res.json({
      authenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Register
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );
    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error("Error occurred during registration:", err);
    res.status(400).json({
      success: false,
      message: "Username already taken or error occurred.",
    });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({
        success: true,
        user: { id: user.id, username: user.username },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

// Logout
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error occurred during logout:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

// Search recipes
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  const url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`;
  try {
    const response = await axios.get(url);
    const results = response.data.results;
    res.json({ success: true, results: results });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipes. Please try again later.",
    });
  }
});

// Get recipe details
app.get("/api/recipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information`,
      { params: { apiKey: apiKey } }
    );
    const recipe = response.data;
    res.json({ success: true, recipe });
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recipe details",
    });
  }
});

// Get favorites
app.get("/api/favorites", isLoggedIn, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM recipes INNER JOIN favorites ON recipes.recipe_id = favorites.recipe_id"
    );
    const favorites = result.rows;
    res.json({ success: true, favorites: favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching favorites",
    });
  }
});

// Add to favorites
app.post("/api/favorite/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, image } = req.body;
  try {
    await db.query(
      "INSERT INTO recipes (recipe_id, title, image_url) VALUES ($1, $2, $3) ON CONFLICT (recipe_id) DO NOTHING",
      [id, title, image]
    );

    await db.query("INSERT INTO favorites (recipe_id) VALUES ($1)", [id]);

    res.json({ success: true, message: "Added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error adding to favorites",
    });
  }
});

// Remove from favorites
app.delete("/api/favorites/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM favorites WHERE recipe_id = $1", [id]);
    res.json({ success: true, message: "Removed from favorites" });
  } catch (err) {
    console.error("Error removing favorite:", err);
    res.status(500).json({
      success: false,
      message: "Error removing favorite",
    });
  }
});

// Serve static React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

app.listen(port, (err) => {
  if (err) {
    return console.log("Could not start server", err);
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
