import express from "express";
import path from "path";
import cors from "cors";
import apiRouter from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// If you run frontend on a different port during dev, enable CORS for local dev only.
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.get("/health", (_req, res) => res.status(200).send("OK"));

// Mount API routes
app.use("/api", apiRouter);

// In prod we’ll copy the Vue build to backend/public and serve it:
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));
app.get("*", (_req, res) => {
  // Serve the SPA index for any unknown route
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
