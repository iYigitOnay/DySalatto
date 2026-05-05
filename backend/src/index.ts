import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import traitRoutes from "./routes/trait.routes";
import ingredientRoutes from "./routes/ingredient.routes";
import productRoutes from "./routes/product.routes";
import orderRoutes from "./routes/order.routes";
import addressRoutes from "./routes/address.routes";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Next.js port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// Static Files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/traits", traitRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "DySalatto API is running" });
});

// Start Server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
