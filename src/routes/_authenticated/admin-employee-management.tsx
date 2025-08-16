import { createFileRoute, redirect } from '@tanstack/react-router'
import AdminEmployeeManagement from '@/features/admin-employee-management'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated/admin-employee-management')({
  component: AdminEmployeeManagement,
  beforeLoad: () => {
    const { isAdmin, isAuthenticated } = useAuthStore.getState().auth
    
    if (!isAuthenticated()) {
      throw redirect({
        to: '/sign-in',
      })
    }
    
    if (!isAdmin()) {
      throw redirect({
        to: '/employee-dashboard',
      })
    }
  },
})
