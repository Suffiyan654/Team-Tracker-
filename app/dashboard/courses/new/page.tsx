import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { CourseForm } from "@/components/course-form"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"

export default async function NewCoursePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "manager") {
    redirect("/dashboard")
  }

  await dbConnect()
  const user = await User.findById(session.userId)

  if (!user) {
    redirect("/login")
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
          <CourseForm mode="create" />
        </div>
      </main>
    </div>
  )
}
