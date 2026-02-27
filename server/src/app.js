import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";
import categorizerRoutes from "./modules/categorizer/categorizer.routes.js";
import proposalRoutes from "./modules/proposal/proposal.routes.js";

const app = express();

// --- Middleware ---
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// --- Routes ---
app.use("/api/categorizer", categorizerRoutes);
app.use("/api/proposal", proposalRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// --- Global Error Handler ---
app.use(errorHandler);

export default app;
