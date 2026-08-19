import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDatabase from "../config/database.js";
import User from "../models/User.js";

async function seedAdmin() {
  console.log("🌱 Starting SuperAdmin database seed script...");

  try {
    await connectDatabase();
    console.log(" Connected to MongoDB.");

    // Check if SuperAdmin already exists
    const existingAdmin = await User.findOne({ role: "superadmin" });
    if (existingAdmin) {
      console.log(`ℹ️ SuperAdmin already exists: ${existingAdmin.email} (Role: ${existingAdmin.role})`);
      console.log("✨ Seeding skipped. No action needed.");
      await mongoose.connection.close();
      process.exit(0);
    }

    const adminName = process.env.ADMIN_NAME || "Super Admin";
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@wellsphere.com").toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@WellSphere2026!";

    // Check if user exists with the same email
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      existingUser.role = "superadmin";
      existingUser.passwordHash = await bcrypt.hash(adminPassword, 12);
      await existingUser.save();
      console.log(`✅ Existing user ${adminEmail} promoted to SuperAdmin.`);
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      const newAdmin = await User.create({
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: "superadmin",
      });
      console.log(`🎉 SuperAdmin created successfully!`);
      console.log(`   - Name: ${newAdmin.name}`);
      console.log(`   - Email: ${newAdmin.email}`);
      console.log(`   - Role: ${newAdmin.role}`);
    }

    console.log("✨ Database seed completed successfully.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed SuperAdmin:", error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedAdmin();
