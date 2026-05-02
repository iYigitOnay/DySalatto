import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // Frontend port
  credentials: true
}));

// --- ROUTES ---
app.use("/api/auth", authRoutes);

// --- HEALTH CHECK ---
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "DySalatto Backend is live" });
});

// --- GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`[server]: Artisan Server is running at http://localhost:${port}`);
});
