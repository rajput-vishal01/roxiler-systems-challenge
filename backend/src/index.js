import express from "express";
import dotenv from "dotenv";
import prisma from "../src/lib/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import userRouter from "./routes/user.route.js";
import storeOwnerRouter from "./routes/storeOwner.route.js";

import cors from "cors"

dotenv.config();
const app = express();

const PORT = process.env.PORT ?? 5000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman, curl)
      if (!origin) return callback(null, true);

      // DEV: allow localhost automatically
      if (process.env.NODE_ENV !== "production") {
        if (origin.includes("localhost")) {
          return callback(null, true);
        }
      }
      // PROD: strict check
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/store-owner", storeOwnerRouter);

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
