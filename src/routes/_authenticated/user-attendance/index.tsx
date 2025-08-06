import { createFileRoute } from '@tanstack/react-router'
import UserAttendance from '@/features/attendance/user-attendance'

export const Route = createFileRoute('/_authenticated/user-attendance/')({
  component: UserAttendance,
}) 