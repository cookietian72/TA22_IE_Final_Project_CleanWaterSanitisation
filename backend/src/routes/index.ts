import { Router } from "express";
import { pool } from "../db/client";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ ok: true, message: "API root" });
});

router.get("/hello", (_req, res) => {
  res.json({ message: "Hello from backend API" });
});

// quick DB ping endpoint (works once DB env vars are set)
router.get("/db-ping", async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
