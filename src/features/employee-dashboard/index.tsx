import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { useAuth } from '@/stores/authStore'
import { AuthService } from '@/services/authService'
import { toast } from 'sonner'
import { 
  Clock, 
  Calendar, 
  CheckSquare, 
  Percent,
  User,
  Activity,
  TrendingUp,
  Award
} from 'lucide-react'

interface EmployeeStats {
  totalTimeSheets: number
  totalLeaves: number
  totalTasks: number
  completedTasks: number
  completionRate: number
}

interface EmployeeProfile {
  empId: number
  empName: string
  empEmail: string
  empTechnology: string
  empRole: string
  isActive: boolean
  statistics: EmployeeStats
}

export default function EmployeeDashboard() {
  const { accessToken, user } = useAuth()
  const [profile, setProfile] = useState<EmployeeProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployeeProfile()
  }, [accessToken])

  const fetchEmployeeProfile = async () => {
    try {
      const response = await AuthService.getUserProfile(accessToken)
      if (response.success) {
        setProfile(response.data)
      } else {
        toast.error(response.message || 'Failed to load profile')
      }
    } catch (error) {
      toast.error('Failed to load employee data')
      console.error('Error fetching employee profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Main>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading employee dashboard...</div>
        </div>
      </Main>
    )
  }

  if (!profile) {
    return (
      <Main>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Failed to load employee data</div>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile.empName}! Here's your activity overview.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={profile.isActive ? "default" : "destructive"}>
              {profile.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant="outline">
              {profile.empTechnology}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Sheets</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.statistics.totalTimeSheets || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total time sheets submitted
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leave Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.statistics.totalLeaves || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total leave requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.statistics.totalTasks || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total tasks assigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.statistics.completionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Task completion rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions you can perform from your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Clock className="h-6 w-6 mb-2" />
                <span>Punch In/Out</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Request Leave</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <CheckSquare className="h-6 w-6 mb-2" />
                <span>View Tasks</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent activities and updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Task Completed</p>
                  <p className="text-xs text-muted-foreground">You completed a task assignment</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Time Sheet Submitted</p>
                  <p className="text-xs text-muted-foreground">Weekly time sheet was submitted</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave Request</p>
                  <p className="text-xs text-muted-foreground">Leave request was approved</p>
                </div>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>
              Your performance metrics and achievements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Productivity</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${profile.statistics.completionRate || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile.statistics.completionRate || 0}% task completion rate
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Attendance</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((profile.statistics.totalTimeSheets || 0) * 10, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {profile.statistics.totalTimeSheets || 0} time sheets submitted
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  )
}

