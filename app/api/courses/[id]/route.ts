import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Course from "@/lib/models/Course"
import { requireManager, requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  try {
    await requireAuth()
    await dbConnect()

    const course = await Course.findById(params.id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Get course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  try {
    const session = await requireManager()
    await dbConnect()

    const body = await request.json()

    const course = await Course.findByIdAndUpdate(
      params.id,
      {
        ...body,
        lastUpdated: new Date(),
        updatedBy: session.email,
      },
      { new: true, runValidators: true },
    )

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Update course error:", error)
    if (error instanceof Error && error.message === "Forbidden: Manager access required") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  try {
    await requireManager()
    await dbConnect()

    const course = await Course.findByIdAndDelete(params.id)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete course error:", error)
    if (error instanceof Error && error.message === "Forbidden: Manager access required") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
