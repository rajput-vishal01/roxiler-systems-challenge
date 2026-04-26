import prisma from "../lib/db.js";
import { hashPassword, isPasswordCorrect } from "../lib/auth.utils.js";

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const valid = await isPasswordCorrect(oldPassword, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashed },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = "name", order = "asc" } = req.query;

    const allowedSortFields = ["name", "address", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = order === "desc" ? "desc" : "asc";

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(address && { address: { contains: address, mode: "insensitive" } }),
      },
      orderBy: { [sortField]: sortOrder },
      select: {
        id: true,
        name: true,
        address: true,
        ratings: {
          select: { value: true, userId: true },
        },
      },
    });

    // attach overall rating + current user's submitted rating
    const result = stores.map((store) => {
      const { ratings, ...rest } = store;

      const overallRating =
        ratings.length > 0
          ? (
              ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length
            ).toFixed(1)
          : null;

      const userRating =
        ratings.find((r) => r.userId === req.user.id)?.value ?? null;

      return { ...rest, overallRating, userRating };
    });

    return res.status(200).json({ stores: result });
  } catch (error) {
    console.error("Get stores error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const submitRating = async (req, res) => {
  try {
    const { storeId, value } = req.body;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // check if already rated
    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Already rated. Use PUT to update." });
    }

    const rating = await prisma.rating.create({
      data: { value, userId: req.user.id, storeId },
    });

    return res
      .status(201)
      .json({ message: "Rating submitted successfully", rating });
  } catch (error) {
    console.error("Submit rating error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateRating = async (req, res) => {
  try {
    const { storeId, value } = req.body;

    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId: req.user.id, storeId } },
    });
    if (!existing) {
      return res
        .status(404)
        .json({ message: "No rating found. Use POST to submit first." });
    }

    const rating = await prisma.rating.update({
      where: { userId_storeId: { userId: req.user.id, storeId } },
      data: { value },
    });

    return res
      .status(200)
      .json({ message: "Rating updated successfully", rating });
  } catch (error) {
    console.error("Update rating error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
