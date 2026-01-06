/**
 * Import Courses from Excel Script
 *
 * This script imports course data from an Excel file or manually defined sample data.
 * You can modify the sampleCourses array below to match your Excel data structure.
 *
 * Run with: node --loader ts-node/esm scripts/import-courses.ts
 */

import mongoose from "mongoose"
import Course from "../lib/models/Course"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edtech-courses"

// Sample course data that matches the Excel structure
// Replace this with actual Excel data parsing if needed
const sampleCourses = [
  // Grade 1
  {
    grade: 1,
    discipline: "Coding",
    courseName: "Introduction to Basic Coding",
    textbookStatus: "Completed",
    workbookStatus: "Completed",
    prerequisites: "None",
    systemRequirements: "Computer with web browser",
  },
  {
    grade: 1,
    discipline: "Robotics",
    courseName: "Simple Machines and Robots",
    textbookStatus: "In Progress",
    workbookStatus: "Not Started",
    prerequisites: "None",
    systemRequirements: "Basic robotics kit",
  },
  // Grade 2
  {
    grade: 2,
    discipline: "Electronics",
    courseName: "Basic Circuits",
    textbookStatus: "Review",
    workbookStatus: "In Progress",
    prerequisites: "None",
    systemRequirements: "Electronics starter kit",
  },
  {
    grade: 2,
    discipline: "Coding",
    courseName: "Block-Based Programming",
    textbookStatus: "Completed",
    workbookStatus: "Completed",
    prerequisites: "Introduction to Basic Coding",
    systemRequirements: "Computer with Scratch",
  },
  // Grade 3-5 samples
  {
    grade: 3,
    discipline: "Mechanical",
    courseName: "Gears and Motion",
    textbookStatus: "In Progress",
    workbookStatus: "Not Started",
    prerequisites: "Simple Machines and Robots",
    systemRequirements: "Mechanical engineering kit",
  },
  {
    grade: 4,
    discipline: "Coding",
    courseName: "Introduction to Python",
    textbookStatus: "Review",
    workbookStatus: "Review",
    prerequisites: "Block-Based Programming",
    systemRequirements: "Computer with Python installed",
  },
  {
    grade: 5,
    discipline: "Robotics",
    courseName: "Programmable Robots",
    textbookStatus: "In Progress",
    workbookStatus: "In Progress",
    prerequisites: "Gears and Motion, Introduction to Python",
    systemRequirements: "Arduino or similar microcontroller, robot kit",
  },
  // Grade 6-8 samples
  {
    grade: 6,
    discipline: "Electronics",
    courseName: "Digital Logic",
    textbookStatus: "Not Started",
    workbookStatus: "Not Started",
    prerequisites: "Basic Circuits",
    systemRequirements: "Logic gates kit, breadboard",
  },
  {
    grade: 7,
    discipline: "Coding",
    courseName: "Web Development Basics",
    textbookStatus: "Completed",
    workbookStatus: "In Progress",
    prerequisites: "Introduction to Python",
    systemRequirements: "Computer with text editor and web browser",
  },
  {
    grade: 8,
    discipline: "Robotics",
    courseName: "Autonomous Robots",
    textbookStatus: "In Progress",
    workbookStatus: "Not Started",
    prerequisites: "Programmable Robots",
    systemRequirements: "Advanced robot kit with sensors",
  },
  // Grade 9-12 samples
  {
    grade: 9,
    discipline: "Coding",
    courseName: "Object-Oriented Programming",
    textbookStatus: "Review",
    workbookStatus: "Review",
    prerequisites: "Web Development Basics",
    systemRequirements: "Computer with Java or C++ IDE",
  },
  {
    grade: 10,
    discipline: "Electronics",
    courseName: "Microcontroller Programming",
    textbookStatus: "In Progress",
    workbookStatus: "In Progress",
    prerequisites: "Digital Logic, Object-Oriented Programming",
    systemRequirements: "Arduino Uno, sensors, actuators",
  },
  {
    grade: 11,
    discipline: "Mechanical",
    courseName: "Advanced Mechanical Systems",
    textbookStatus: "Not Started",
    workbookStatus: "Not Started",
    prerequisites: "Gears and Motion",
    systemRequirements: "Advanced mechanical engineering kit",
  },
  {
    grade: 12,
    discipline: "Robotics",
    courseName: "AI and Machine Learning in Robotics",
    textbookStatus: "Not Started",
    workbookStatus: "Not Started",
    prerequisites: "Autonomous Robots, Object-Oriented Programming",
    systemRequirements: "Computer with ML libraries, robot platform",
  },
]

async function importCourses() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI)
    console.log("Connected to MongoDB")

    // Check if courses already exist
    const existingCourses = await Course.find()
    if (existingCourses.length > 0) {
      console.log(`Found ${existingCourses.length} existing course(s)`)
      console.log("Do you want to:")
      console.log("  1. Skip import (keeping existing data)")
      console.log("  2. Clear and reimport")
      console.log("\nFor safety, this script will skip import.")
      console.log("To clear existing data, run: db.courses.deleteMany({}) in MongoDB")
      process.exit(0)
    }

    console.log(`Importing ${sampleCourses.length} courses...`)

    for (const courseData of sampleCourses) {
      const course = await Course.create({
        ...courseData,
        updatedBy: "system",
      })
      console.log(`✓ Created: Grade ${course.grade} - ${course.courseName}`)
    }

    console.log("\n=== Import Complete ===")
    console.log(`Successfully imported ${sampleCourses.length} courses`)
    console.log("\nCourses by Grade:")

    const coursesByGrade = await Course.aggregate([
      { $group: { _id: "$grade", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    coursesByGrade.forEach(({ _id, count }) => {
      console.log(`  Grade ${_id}: ${count} course(s)`)
    })

    process.exit(0)
  } catch (error) {
    console.error("Error importing courses:", error)
    process.exit(1)
  }
}

importCourses()
