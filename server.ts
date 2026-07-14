import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // Proxy endpoint to bypass CORS for Player Name lookup
  app.get("/api/player-name", async (req, res) => {
    const uid = req.query.uid;
    if (!uid) {
      return res.status(400).json({ error: true, msg: "UID is required" });
    }
    try {
      const response = await fetch(`https://name-api-zeta.vercel.app/?uid=${uid}`);
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      console.error("Proxy fetch failed:", err);
      res.status(500).json({ error: true, msg: err.message || "Failed to fetch from API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
