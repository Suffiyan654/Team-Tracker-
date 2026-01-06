"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Eye } from "lucide-react"
import type { ICourse } from "@/lib/models/Course"

interface CourseTableProps {
  courses: ICourse[]
  userRole: "manager" | "employee"
  onEdit?: (course: ICourse) => void
  onView?: (course: ICourse) => void
}

const statusColors = {
  "Not Started": "bg-muted text-muted-foreground",
  "In Progress": "bg-chart-2 text-white",
  Review: "bg-chart-3 text-white",
  Completed: "bg-primary text-primary-foreground",
}

export function CourseTable({ courses, userRole, onEdit, onView }: CourseTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grade</TableHead>
            <TableHead>Discipline</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Textbook</TableHead>
            <TableHead>Workbook</TableHead>
            <TableHead>Prerequisites</TableHead>
            <TableHead>System Requirements</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No courses found. {userRole === "manager" && "Add your first course to get started."}
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow key={course._id.toString()}>
                <TableCell className="font-medium">Grade {course.grade}</TableCell>
                <TableCell>{course.discipline}</TableCell>
                <TableCell className="font-medium">{course.courseName}</TableCell>
                <TableCell>
                  <Badge className={statusColors[course.textbookStatus as keyof typeof statusColors]}>
                    {course.textbookStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[course.workbookStatus as keyof typeof statusColors]}>
                    {course.workbookStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{course.prerequisites}</TableCell>
                <TableCell className="text-muted-foreground">{course.systemRequirements}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView?.(course)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {userRole === "manager" && (
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(course)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
