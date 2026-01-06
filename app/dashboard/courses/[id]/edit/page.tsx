import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { CourseForm } from "@/components/course-form"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Course from "@/lib/models/Course"

export default async function EditCoursePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "manager") {
    redirect("/dashboard")
  }

  await dbConnect()
  const user = await User.findById(session.userId)
  const course = await Course.findById(params.id)

  if (!user) {
    redirect("/login")
  }

  if (!course) {
    redirect("/dashboard")
  }

  // Convert Mongoose document to plain object for client component
  const courseData = {
    _id: course._id.toString(),
    grade: course.grade,
    discipline: course.discipline,
    courseName: course.courseName,
    textbookStatus: course.textbookStatus,
    workbookStatus: course.workbookStatus,
    prerequisites: course.prerequisites,
    systemRequirements: course.systemRequirements,
    lastUpdated: course.lastUpdated.toISOString(),
    updatedBy: course.updatedBy,
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <CourseForm mode="edit" course={courseData as any} />
        </div>
      </main>
    </div>
  )
}
