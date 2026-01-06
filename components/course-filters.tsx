"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CourseFiltersProps {
  grade: string
  discipline: string
  textbookStatus: string
  workbookStatus: string
  onGradeChange: (value: string) => void
  onDisciplineChange: (value: string) => void
  onTextbookStatusChange: (value: string) => void
  onWorkbookStatusChange: (value: string) => void
}

export function CourseFilters({
  grade,
  discipline,
  textbookStatus,
  workbookStatus,
  onGradeChange,
  onDisciplineChange,
  onTextbookStatusChange,
  onWorkbookStatusChange,
}: CourseFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        <Select value={grade} onValueChange={onGradeChange}>
          <SelectTrigger id="grade">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
              <SelectItem key={g} value={g.toString()}>
                Grade {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="discipline">Discipline</Label>
        <Select value={discipline} onValueChange={onDisciplineChange}>
          <SelectTrigger id="discipline">
            <SelectValue placeholder="All Disciplines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Disciplines</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Coding">Coding</SelectItem>
            <SelectItem value="Mechanical">Mechanical</SelectItem>
            <SelectItem value="Robotics">Robotics</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textbook">Textbook Status</Label>
        <Select value={textbookStatus} onValueChange={onTextbookStatusChange}>
          <SelectTrigger id="textbook">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="workbook">Workbook Status</Label>
        <Select value={workbookStatus} onValueChange={onWorkbookStatusChange}>
          <SelectTrigger id="workbook">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
