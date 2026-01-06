import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Course from "@/lib/models/Course"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const grade = searchParams.get("grade")
    const discipline = searchParams.get("discipline")
    const textbookStatus = searchParams.get("textbookStatus")
    const workbookStatus = searchParams.get("workbookStatus")

    // Build filter query
    const filter: Record<string, unknown> = {}
    if (grade) filter.grade = Number.parseInt(grade)
    if (discipline) filter.discipline = discipline
    if (textbookStatus) filter.textbookStatus = textbookStatus
    if (workbookStatus) filter.workbookStatus = workbookStatus

    const courses = await Course.find(filter).sort({ grade: 1, discipline: 1 })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Get courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()
    await dbConnect()

    const body = await request.json()

    const course = await Course.create({
      ...body,
      updatedBy: session.email,
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Create course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
