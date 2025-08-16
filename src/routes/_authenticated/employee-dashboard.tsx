import { createFileRoute, redirect } from '@tanstack/react-router'
import EmployeeDashboard from '@/features/employee-dashboard'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated/employee-dashboard')({
  component: EmployeeDashboard,
  beforeLoad: () => {
    const { isEmployee, isAuthenticated } = useAuthStore.getState().auth
    
    if (!isAuthenticated()) {
      throw redirect({
        to: '/sign-in',
      })
    }
    
    if (!isEmployee()) {
      throw redirect({
        to: '/admin-dashboard',
      })
    }
  },
})
