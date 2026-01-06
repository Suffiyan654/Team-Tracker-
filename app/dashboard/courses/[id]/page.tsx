import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import dbConnect from "@/lib/mongodb"
import User from "@/lib/models/User"
import Course from "@/lib/models/Course"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

const statusColors = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-chart-2 text-white",
  Review: "bg-chart-3 text-white",
  Completed: "bg-primary text-primary-foreground",
}

export default async function CourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const session = await getSession()

  if (!session) {
    redirect("/login")
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
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            {user.role === "manager" && (
              <Link href={`/dashboard/courses/${params.id}/edit`}>
                <Button size="sm">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Course
                </Button>
              </Link>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl">{course.courseName}</CardTitle>
                  <CardDescription className="mt-2">
                    Grade {course.grade} • {course.discipline}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Textbook Status</Label>
                  <div>
                    <Badge className={statusColors[course.textbookStatus as keyof typeof statusColors]}>
                      {course.textbookStatus}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Workbook Status</Label>
                  <div>
                    <Badge className={statusColors[course.workbookStatus as keyof typeof statusColors]}>
                      {course.workbookStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Course Prerequisites</Label>
                <p className="text-muted-foreground">{course.prerequisites}</p>
              </div>

              <div className="space-y-2">
                <Label>System / Kit Requirements</Label>
                <p className="text-muted-foreground">{course.systemRequirements}</p>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Last updated: {format(new Date(course.lastUpdated), "PPP 'at' p")}</p>
                  {course.updatedBy && <p>Updated by: {course.updatedBy}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-foreground">{children}</p>
}
