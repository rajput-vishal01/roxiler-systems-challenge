import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Password@1", 10);

  // ─── ADMIN ───────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@roxiler.com" },
    update: {},
    create: {
      name: "System Administrator Main Account",
      email: "admin@roxiler.com",
      password: hashedPassword,
      address: "123 Admin Street Mumbai Maharashtra India",
      role: "ADMIN",
    },
  });

  // ─── NORMAL USERS ────────────────────────────────────
  const user1 = await prisma.user.upsert({
    where: { email: "john.doe@gmail.com" },
    update: {},
    create: {
      name: "John Doe Normal Platform User",
      email: "john.doe@gmail.com",
      password: hashedPassword,
      address: "456 User Lane New Delhi India",
      role: "USER",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane.smith@gmail.com" },
    update: {},
    create: {
      name: "Jane Smith Regular Platform User",
      email: "jane.smith@gmail.com",
      password: hashedPassword,
      address: "789 Smith Road Bangalore Karnataka India",
      role: "USER",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: "rahul.verma@gmail.com" },
    update: {},
    create: {
      name: "Rahul Verma Registered Normal User",
      email: "rahul.verma@gmail.com",
      password: hashedPassword,
      address: "12 MG Road Pune Maharashtra India",
      role: "USER",
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: "priya.sharma@gmail.com" },
    update: {},
    create: {
      name: "Priya Sharma Active Normal User",
      email: "priya.sharma@gmail.com",
      password: hashedPassword,
      address: "34 Park Street Kolkata West Bengal India",
      role: "USER",
    },
  });

  // ─── STORE OWNERS ────────────────────────────────────
  const owner1 = await prisma.user.upsert({
    where: { email: "owner.pizza@gmail.com" },
    update: {},
    create: {
      name: "Pizza Palace Owner Store Account",
      email: "owner.pizza@gmail.com",
      password: hashedPassword,
      address: "12 Food Street Pune Maharashtra India",
      role: "STORE_OWNER",
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "owner.cafe@gmail.com" },
    update: {},
    create: {
      name: "Cafe Mocha Owner Store Account",
      email: "owner.cafe@gmail.com",
      password: hashedPassword,
      address: "34 Brew Lane Chennai Tamil Nadu India",
      role: "STORE_OWNER",
    },
  });

  const owner3 = await prisma.user.upsert({
    where: { email: "owner.burger@gmail.com" },
    update: {},
    create: {
      name: "Burger Hub Owner Store Account",
      email: "owner.burger@gmail.com",
      password: hashedPassword,
      address: "56 Fast Food Avenue Hyderabad Telangana India",
      role: "STORE_OWNER",
    },
  });

  // ─── STORES ──────────────────────────────────────────
  const store1 = await prisma.store.upsert({
    where: { email: "pizzapalace@store.com" },
    update: {},
    create: {
      name: "Pizza Palace",
      email: "pizzapalace@store.com",
      address: "12 Food Street Pune Maharashtra India",
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: "cafemocha@store.com" },
    update: {},
    create: {
      name: "Cafe Mocha",
      email: "cafemocha@store.com",
      address: "34 Brew Lane Chennai Tamil Nadu India",
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.upsert({
    where: { email: "burgerhub@store.com" },
    update: {},
    create: {
      name: "Burger Hub",
      email: "burgerhub@store.com",
      address: "56 Fast Food Avenue Hyderabad Telangana India",
      ownerId: owner3.id,
    },
  });

  // ─── RATINGS ─────────────────────────────────────────
  // user1 rates all 3 stores
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store1.id } },
    update: {},
    create: { value: 5, userId: user1.id, storeId: store1.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store2.id } },
    update: {},
    create: { value: 3, userId: user1.id, storeId: store2.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store3.id } },
    update: {},
    create: { value: 4, userId: user1.id, storeId: store3.id },
  });

  // user2 rates all 3 stores
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store1.id } },
    update: {},
    create: { value: 4, userId: user2.id, storeId: store1.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store2.id } },
    update: {},
    create: { value: 5, userId: user2.id, storeId: store2.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store3.id } },
    update: {},
    create: { value: 2, userId: user2.id, storeId: store3.id },
  });

  // user3 rates 2 stores
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user3.id, storeId: store1.id } },
    update: {},
    create: { value: 3, userId: user3.id, storeId: store1.id },
  });
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user3.id, storeId: store3.id } },
    update: {},
    create: { value: 5, userId: user3.id, storeId: store3.id },
  });

  // user4 rates 1 store
  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user4.id, storeId: store2.id } },
    update: {},
    create: { value: 4, userId: user4.id, storeId: store2.id },
  });

  console.log("✅ Seed complete");
  console.log(`
  ── Users ──────────────────────────────
  Admin        : admin@roxiler.com
  User 1       : john.doe@gmail.com
  User 2       : jane.smith@gmail.com
  User 3       : rahul.verma@gmail.com
  User 4       : priya.sharma@gmail.com
  Store Owner 1: owner.pizza@gmail.com
  Store Owner 2: owner.cafe@gmail.com
  Store Owner 3: owner.burger@gmail.com

  ── Stores ─────────────────────────────
  Pizza Palace  → owner.pizza@gmail.com
  Cafe Mocha    → owner.cafe@gmail.com
  Burger Hub    → owner.burger@gmail.com

  ── All passwords: Password@1 ──────────
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });