/**
 * Seed Users Script
 *
 * This script creates initial test users for the system.
 * Run with: npm run seed:users
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import mongoose from "mongoose"
import User from "../lib/models/User"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edtech-courses"

async function seedUsers() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if users already exist
    const existingUsers = await User.find()
    if (existingUsers.length > 0) {
      console.log("Users already exist. Skipping seed.")
      console.log(`Found ${existingUsers.length} existing user(s)`)
      process.exit(0)
    }

    // Create test users
    const users = [
      {
        name: "Admin Manager",
        email: "manager@edtech.com",
        password: "manager123",
        role: "manager" as const,
      },
      {
        name: "John Employee",
        email: "employee@edtech.com",
        password: "employee123",
        role: "employee" as const,
      },
    ]

    console.log("Creating users...")
    for (const userData of users) {
      const user = await User.create(userData)
      console.log(`✓ Created ${user.role}: ${user.email}`)
    }

    console.log("\n=== Seed Complete ===")
    console.log("Test Accounts:")
    console.log("\nManager Account:")
    console.log("  Email: manager@edtech.com")
    console.log("  Password: manager123")
    console.log("\nEmployee Account:")
    console.log("  Email: employee@edtech.com")
    console.log("  Password: employee123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding users:", error)
    process.exit(1)
  }
}

seedUsers()
