import prisma from "../lib/db.js";
import jwt from "jsonwebtoken";
import {
  hashPassword,
  isPasswordCorrect,
  generateAccessToken,
  generateRefreshToken,
} from "../lib/auth.utils.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const issueTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
};

export const generateRefreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      oldRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || oldRefreshToken !== user.refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await issueTokens(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json({
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address },
    });

    const { accessToken, refreshToken } = await issueTokens(user);

    const safeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, address: true, role: true },
    });

    return res
      .status(201)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "User Created Successfully",
        user: safeUser,
        accessToken,
      });
  } catch (error) {
    console.error("Error in signup:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during signup" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const valid = await isPasswordCorrect(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await issueTokens(user);

    const safeUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true, address: true, role: true },
    });

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        message: "User logged in successfully",
        user: safeUser,
        accessToken,
      });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during login" });
  }
};

export const logout = async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during logout" });
  }
};
