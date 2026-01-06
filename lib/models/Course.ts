import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ICourse extends Document {
  grade: number
  discipline: string
  courseName: string
  textbookStatus: string
  workbookStatus: string
  prerequisites: string
  systemRequirements: string
  lastUpdated: Date
  updatedBy?: string
}

const CourseSchema = new Schema<ICourse>({
  grade: {
    type: Number,
    required: [true, "Please provide a grade"],
    min: 1,
    max: 12,
  },
  discipline: {
    type: String,
    required: [true, "Please provide a discipline"],
    enum: ["Electronics", "Coding", "Mechanical", "Robotics", "Other"],
  },
  courseName: {
    type: String,
    required: [true, "Please provide a course name"],
  },
  textbookStatus: {
    type: String,
    required: [true, "Please provide textbook status"],
    enum: ["Not Started", "In Progress", "Review", "Completed"],
    default: "Not Started",
  },
  workbookStatus: {
    type: String,
    required: [true, "Please provide workbook status"],
    enum: ["Not Started", "In Progress", "Review", "Completed"],
    default: "Not Started",
  },
  prerequisites: {
    type: String,
    default: "None",
  },
  systemRequirements: {
    type: String,
    default: "None",
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
})

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema)

export default Course
