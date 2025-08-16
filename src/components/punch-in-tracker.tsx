import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Coffee, LogOut, Play, Pause, Square } from 'lucide-react'
import { BarChart3 } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/stores/authStore'
import { API_CONFIG, API_ENDPOINTS } from '@/config/api'
import { AuthService } from '@/services/authService'
import { toast } from 'sonner'

interface PunchInTrackerProps {
  className?: string
}

interface TimeSheetStatus {
  isPunchedIn: boolean
  isOnBreak: boolean
  clockInTime: string
  breakStartTime: string
  totalWorkHours: number
  totalBreakTime: number
}

export function PunchInTracker({ className = '' }: PunchInTrackerProps) {
  const { accessToken, user } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeSheetStatus, setTimeSheetStatus] = useState<TimeSheetStatus>({
    isPunchedIn: false,
    isOnBreak: false,
    clockInTime: '',
    breakStartTime: '',
    totalWorkHours: 0,
    totalBreakTime: 0
  })
  const [loading, setLoading] = useState(false)
  
  // Confirmation dialog states
  const [showPunchInDialog, setShowPunchInDialog] = useState(false)
  const [showPunchOutDialog, setShowPunchOutDialog] = useState(false)
  const [showBreakDialog, setShowBreakDialog] = useState(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch current timesheet status on component mount
  useEffect(() => {
    if (accessToken) {
      fetchCurrentStatus()
    }
  }, [accessToken])

  const fetchCurrentStatus = async () => {
    try {
      const headers = AuthService.getAuthHeaders(accessToken)
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.timesheet.currentStatus}`, {
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTimeSheetStatus(data.data)
        }
      }
    } catch (error) {
      console.error('Error fetching timesheet status:', error)
    }
  }

  const handlePunchIn = async () => {
    setLoading(true)
    try {
      const headers = AuthService.getAuthHeaders(accessToken)
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.timesheet.clockIn}`, {
        method: 'POST',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Punched in successfully!')
          setTimeSheetStatus(prev => ({ ...prev, isPunchedIn: true, clockInTime: new Date().toISOString() }))
        }
      } else {
        toast.error('Failed to punch in')
      }
    } catch (error) {
      toast.error('Error punching in')
    } finally {
      setLoading(false)
      setShowPunchInDialog(false)
    }
  }

  const handlePunchOut = async () => {
    setLoading(true)
    try {
      const headers = AuthService.getAuthHeaders(accessToken)
      const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.timesheet.clockOut}`, {
        method: 'POST',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Punched out successfully!')
          setTimeSheetStatus(prev => ({ 
            ...prev, 
            isPunchedIn: false, 
            isOnBreak: false,
            clockInTime: '',
            breakStartTime: ''
          }))
        }
      } else {
        toast.error('Failed to punch out')
      }
    } catch (error) {
      toast.error('Error punching out')
    } finally {
      setLoading(false)
      setShowPunchOutDialog(false)
    }
  }

  const handleTakeBreak = async () => {
    setLoading(true)
    try {
      const headers = AuthService.getAuthHeaders(accessToken)
      const endpoint = timeSheetStatus.isOnBreak ? API_ENDPOINTS.timesheet.breakEnd : API_ENDPOINTS.timesheet.breakStart
      const response = await fetch(`${API_CONFIG.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          const action = timeSheetStatus.isOnBreak ? 'Break ended' : 'Break started'
          toast.success(`${action} successfully!`)
          setTimeSheetStatus(prev => ({ 
            ...prev, 
            isOnBreak: !prev.isOnBreak,
            breakStartTime: prev.isOnBreak ? '' : new Date().toISOString()
          }))
        }
      } else {
        toast.error(`Failed to ${timeSheetStatus.isOnBreak ? 'end' : 'start'} break`)
      }
    } catch (error) {
      toast.error(`Error ${timeSheetStatus.isOnBreak ? 'ending' : 'starting'} break`)
    } finally {
      setLoading(false)
      setShowBreakDialog(false)
      setShowResumeDialog(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatHours = (hours: number) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${h}h ${m}m`
  }

  return (
    <>
      <div className={`flex items-center justify-between w-full ${className}`}>
        {/* Left side - Time tracking info */}
        <div className='flex items-center space-x-4 text-sm overflow-hidden'>
          <SidebarTrigger 
            variant='outline' 
            className='w-8 h-8 p-0 flex-shrink-0 mr-2'
            style={{ minWidth: 32, minHeight: 32 }}
          />
          <div className='flex items-center space-x-2 flex-shrink-0'>
            <Clock className='h-4 w-4 text-muted-foreground' />
            <span className='whitespace-nowrap font-bold'>{formatTime(currentTime)}</span>
          </div>
          
          {timeSheetStatus.clockInTime && (
            <div className='flex items-center space-x-2 flex-shrink-0'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='whitespace-nowrap'>
                Started at <span className='font-bold'>{formatTime(new Date(timeSheetStatus.clockInTime))}</span>
              </span>
            </div>
          )}
          
          <div className='flex items-center space-x-2 flex-shrink-0'>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
            <span className='whitespace-nowrap'>{formatHours(timeSheetStatus.totalWorkHours)} Today</span>
          </div>
          
          {timeSheetStatus.isOnBreak && (
            <div className='flex items-center space-x-2 flex-shrink-0'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='whitespace-nowrap'>{formatHours(timeSheetStatus.totalBreakTime)} Break</span>
            </div>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className='flex items-center space-x-2 flex-shrink-0 ml-4'>
          {timeSheetStatus.isPunchedIn && (
            <Button
              onClick={() => timeSheetStatus.isOnBreak ? setShowResumeDialog(true) : setShowBreakDialog(true)}
              variant='outline'
              size='sm'
              className={`${
                timeSheetStatus.isOnBreak 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <Coffee className='h-4 w-4 mr-1' />
              <span className='hidden sm:inline'>{timeSheetStatus.isOnBreak ? 'Resume' : 'Take Break'}</span>
            </Button>
          )}
          
          {timeSheetStatus.isPunchedIn && !timeSheetStatus.isOnBreak && (
            <Button
              onClick={() => setShowPunchOutDialog(true)}
              variant='outline'
              size='sm'
              disabled={loading}
              className='bg-red-500 text-white hover:bg-red-600 border-red-500'
            >
              <Square className='h-4 w-4 mr-1' />
              <span className='hidden sm:inline'>Punch Out</span>
            </Button>
          )}
          
          {!timeSheetStatus.isPunchedIn && (
            <Button
              onClick={() => setShowPunchInDialog(true)}
              variant='outline'
              size='sm'
              disabled={loading}
              className='bg-green-500 text-white hover:bg-green-600 border-green-500'
            >
              <Play className='h-4 w-4 mr-1' />
              <span className='hidden sm:inline'>Punch In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog open={showPunchInDialog} onOpenChange={setShowPunchInDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Punch In</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to punch in? This will start tracking your work time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePunchIn} disabled={loading}>
              {loading ? 'Punching In...' : 'Punch In'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPunchOutDialog} onOpenChange={setShowPunchOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Punch Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to punch out? This will end your work session for today.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePunchOut} disabled={loading}>
              {loading ? 'Punching Out...' : 'Punch Out'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Take Break</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start your break? This will pause your work time tracking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTakeBreak} disabled={loading}>
              {loading ? 'Starting Break...' : 'Start Break'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Work</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resume work? This will end your break and continue tracking work time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTakeBreak} disabled={loading}>
              {loading ? 'Resuming...' : 'Resume Work'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}