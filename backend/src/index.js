import express from "express";
import dotenv from "dotenv";
import prisma from "../src/lib/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api/admin", adminRouter);

const start = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Backend is live on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1); // kill server if DB fails
  }
};

start();
