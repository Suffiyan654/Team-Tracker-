"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { CourseFilters } from "@/components/course-filters"
import { CourseTable } from "@/components/course-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ICourse } from "@/lib/models/Course"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string; role: "manager" | "employee" } | null>(null)
  const [courses, setCourses] = useState<ICourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [grade, setGrade] = useState("all")
  const [discipline, setDiscipline] = useState("all")
  const [textbookStatus, setTextbookStatus] = useState("all")
  const [workbookStatus, setWorkbookStatus] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchCourses()
  }, [])

  useEffect(() => {
    fetchCourses()
  }, [grade, discipline, textbookStatus, workbookStatus])

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Failed to fetch user:", error)
    }
  }

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (grade !== "all") params.append("grade", grade)
      if (discipline !== "all") params.append("discipline", discipline)
      if (textbookStatus !== "all") params.append("textbookStatus", textbookStatus)
      if (workbookStatus !== "all") params.append("workbookStatus", workbookStatus)

      const response = await fetch(`/api/courses?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Course Overview</h2>
              <p className="text-muted-foreground mt-1">Track updates across all grades and disciplines</p>
            </div>
            {user.role === "manager" && (
              <Button onClick={() => router.push("/dashboard/courses/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            )}
          </div>

          <CourseFilters
            grade={grade}
            discipline={discipline}
            textbookStatus={textbookStatus}
            workbookStatus={workbookStatus}
            onGradeChange={setGrade}
            onDisciplineChange={setDiscipline}
            onTextbookStatusChange={setTextbookStatus}
            onWorkbookStatusChange={setWorkbookStatus}
          />

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading courses...</div>
          ) : (
            <CourseTable
              courses={courses}
              userRole={user.role}
              onView={(course) => router.push(`/dashboard/courses/${course._id}`)}
              onEdit={(course) => router.push(`/dashboard/courses/${course._id}/edit`)}
            />
          )}
        </div>
      </main>
    </div>
  )
}
