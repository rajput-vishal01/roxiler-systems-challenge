import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, 10);
};

export const isPasswordCorrect = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? "1d" },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? "7d",
  });
};
