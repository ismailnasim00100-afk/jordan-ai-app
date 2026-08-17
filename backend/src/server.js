const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// ==========================================
// Supabase
// ==========================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(
    supabaseUrl,
    supabaseKey
  );
}

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "JORDAN AI",
    message: "JORDAN AI Backend is running 🚀"
  });
});

// ==========================================
// Supabase Status
// ==========================================

app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    backend: "online",
    supabase: supabase ? "configured" : "not_configured"
  });
});

// ==========================================
// Get Current User
// ==========================================

app.get("/api/me", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase is not configured"
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session"
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, display_name, role, created_at, updated_at")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.json({
      success: true,
      user: profile
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// ==========================================
// Owner Check
// ==========================================

app.get("/api/owner/check", async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: "Supabase is not configured"
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session"
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({
        success: false,
        message: "Profile not found"
      });
    }

    if (profile.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Owner access required"
      });
    }

    res.json({
      success: true,
      owner: true,
      user: profile
    });
  } catch (error) {
    console.error("OWNER CHECK ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ==========================================
// Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JORDAN AI Backend running on port ${PORT}`);
});
