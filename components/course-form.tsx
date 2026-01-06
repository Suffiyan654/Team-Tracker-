"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { ICourse } from "@/lib/models/Course"

interface CourseFormProps {
  course?: ICourse
  mode: "create" | "edit"
}

export function CourseForm({ course, mode }: CourseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    grade: course?.grade?.toString() || "",
    discipline: course?.discipline || "",
    courseName: course?.courseName || "",
    textbookStatus: course?.textbookStatus || "Not Started",
    workbookStatus: course?.workbookStatus || "Not Started",
    prerequisites: course?.prerequisites || "None",
    systemRequirements: course?.systemRequirements || "None",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = mode === "create" ? "/api/courses" : `/api/courses/${course?._id}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          grade: Number.parseInt(formData.grade),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save course")
      }

      toast({
        title: mode === "create" ? "Course created" : "Course updated",
        description: `${formData.courseName} has been ${mode === "create" ? "created" : "updated"} successfully.`,
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/courses/${course?._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete course")
      }

      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      })

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "create" ? "Create New Course" : "Edit Course"}</CardTitle>
        <CardDescription>
          {mode === "create" ? "Add a new course to the tracking system" : "Update course information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="grade">
                Grade <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.grade}
                onValueChange={(value) => setFormData({ ...formData, grade: value })}
                required
              >
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                    <SelectItem key={g} value={g.toString()}>
                      Grade {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discipline">
                Discipline <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.discipline}
                onValueChange={(value) => setFormData({ ...formData, discipline: value })}
                required
              >
                <SelectTrigger id="discipline">
                  <SelectValue placeholder="Select discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Robotics">Robotics</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseName">
              Course Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="courseName"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="e.g., Introduction to Robotics"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="textbookStatus">
                Textbook Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.textbookStatus}
                onValueChange={(value) => setFormData({ ...formData, textbookStatus: value })}
                required
              >
                <SelectTrigger id="textbookStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workbookStatus">
                Workbook Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.workbookStatus}
                onValueChange={(value) => setFormData({ ...formData, workbookStatus: value })}
                required
              >
                <SelectTrigger id="workbookStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prerequisites">Course Prerequisites</Label>
            <Textarea
              id="prerequisites"
              value={formData.prerequisites}
              onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
              placeholder="List any prerequisites for this course"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="systemRequirements">System / Kit Requirements</Label>
            <Textarea
              id="systemRequirements"
              value={formData.systemRequirements}
              onChange={(e) => setFormData({ ...formData, systemRequirements: e.target.value })}
              placeholder="List required systems, kits, or equipment"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : mode === "create" ? "Create Course" : "Update Course"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
            </div>
            {mode === "edit" && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                Delete Course
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
