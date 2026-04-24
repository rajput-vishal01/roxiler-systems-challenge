import express from "express";
import dotenv from "dotenv";
import prisma from "./lib/db.js";

dotenv.config();
const app = express();

app.use(express.json());

const PORT = process.env.PORT ?? 5000;

app.get("/", (req, res) => {
  res.send("hello");
});

const start = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected ✅");

    app.listen(PORT, () => {
      console.log(`Backend is live on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.error("DB connection failed ❌", err);
    process.exit(1); // kill server if DB fails
  }
};

start();
