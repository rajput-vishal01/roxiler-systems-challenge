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

export const getDashboard = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { ownerId: req.user.id },
      select: {
        id: true,
        name: true,
        address: true,
        ratings: {
          select: {
            value: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "No store found for this owner" });
    }

    const averageRating =
      store.ratings.length > 0
        ? (
            store.ratings.reduce((acc, r) => acc + r.value, 0) /
            store.ratings.length
          ).toFixed(1)
        : null;

    // list of users who rated with their submitted value
    const raters = store.ratings.map((r) => ({
      ...r.user,
      ratingGiven: r.value,
    }));

    return res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating,
        raters,
      },
    });
  } catch (error) {
    console.error("Store owner dashboard error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
