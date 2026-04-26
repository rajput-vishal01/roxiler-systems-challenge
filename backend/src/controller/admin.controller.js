import prisma from "../lib/db.js";
import { hashPassword } from "../lib/auth.utils.js";

export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return res.status(200).json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const allowedSortFields = ["name", "email", "address", "role", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = order === "desc" ? "desc" : "asc";

    const users = await prisma.user.findMany({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(email && { email: { contains: email, mode: "insensitive" } }),
        ...(address && { address: { contains: address, mode: "insensitive" } }),
        ...(role && { role: role }),
      },
      orderBy: { [sortField]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Add user error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        // if store owner, include their store's average rating
        store: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: { value: true },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compute average rating if store owner
    let averageRating = null;
    if (user.store && user.store.ratings.length > 0) {
      const sum = user.store.ratings.reduce((acc, r) => acc + r.value, 0);
      averageRating = (sum / user.store.ratings.length).toFixed(1);
    }

    const { store, ...userData } = user;
    return res.status(200).json({
      user: {
        ...userData,
        ...(user.role === "STORE_OWNER" && { averageRating }),
      },
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", order = "asc" } = req.query;

    const allowedSortFields = ["name", "email", "address", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const sortOrder = order === "desc" ? "desc" : "asc";

    const stores = await prisma.store.findMany({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(email && { email: { contains: email, mode: "insensitive" } }),
        ...(address && { address: { contains: address, mode: "insensitive" } }),
      },
      orderBy: { [sortField]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ratings: {
          select: { value: true },
        },
      },
    });

    const storesWithRating = stores.map((store) => {
      const { ratings, ...rest } = store;
      const averageRating =
        ratings.length > 0
          ? (
              ratings.reduce((acc, r) => acc + r.value, 0) / ratings.length
            ).toFixed(1)
          : null;
      return { ...rest, averageRating };
    });

    return res.status(200).json({ stores: storesWithRating });
  } catch (error) {
    console.error("Get stores error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // check owner exists and is a STORE_OWNER
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    if (owner.role !== "STORE_OWNER") {
      return res.status(400).json({ message: "User is not a Store Owner" });
    }

    // check store with email doesn't exist
    const existing = await prisma.store.findUnique({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Store with this email already exists" });
    }

    // check owner doesn't already have a store
    const existingStore = await prisma.store.findUnique({ where: { ownerId } });
    if (existingStore) {
      return res
        .status(409)
        .json({ message: "This owner already has a store" });
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ownerId: true,
      },
    });

    return res
      .status(201)
      .json({ message: "Store created successfully", store });
  } catch (error) {
    console.error("Add store error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
