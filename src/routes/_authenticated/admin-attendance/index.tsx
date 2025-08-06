import { createFileRoute } from '@tanstack/react-router'
import AdminAttendance from '@/features/attendance/admin-attendance'

export const Route = createFileRoute('/_authenticated/admin-attendance/')({
  component: AdminAttendance,
}) 