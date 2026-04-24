import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - user not found" });
    }

    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - invalid token" });
  }
};

// role based guard — use after verifyJWT
export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Required role: ${roles.join(" or ")}`,
    });
  }
  next();
};