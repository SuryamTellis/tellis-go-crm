import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Clock, Coffee, LogOut } from 'lucide-react'
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

interface PunchInTrackerProps {
  className?: string
}

export function PunchInTracker({ className = '' }: PunchInTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null)
  const [todayHours, setTodayHours] = useState(0)
  const [breakHours, setBreakHours] = useState(0)
  
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

  // Calculate today's hours and break time
  useEffect(() => {
    if (startTime) {
      const diff = currentTime.getTime() - startTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setTodayHours(hours + minutes / 60)
    }

    if (breakStartTime && isOnBreak) {
      const diff = currentTime.getTime() - breakStartTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setBreakHours(hours + minutes / 60)
    }
  }, [currentTime, startTime, breakStartTime, isOnBreak])

  const handlePunchIn = () => {
    if (!isPunchedIn) {
      setIsPunchedIn(true)
      setStartTime(new Date())
    }
  }

  const handlePunchOut = () => {
    setIsPunchedIn(false)
    setStartTime(null)
    setIsOnBreak(false)
    setBreakStartTime(null)
    setBreakHours(0)
  }

  const handleTakeBreak = () => {
    if (isPunchedIn && !isOnBreak) {
      setIsOnBreak(true)
      setBreakStartTime(new Date())
    } else if (isOnBreak) {
      setIsOnBreak(false)
      setBreakStartTime(null)
      setBreakHours(0)
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
          
          {startTime && (
            <div className='flex items-center space-x-2 flex-shrink-0'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='whitespace-nowrap'>
                Started at <span className='font-bold'>{formatTime(startTime)}</span>
              </span>
            </div>
          )}
          
          <div className='flex items-center space-x-2 flex-shrink-0'>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
            <span className='whitespace-nowrap'>{formatHours(todayHours)} Today</span>
          </div>
          
          {isOnBreak && (
            <div className='flex items-center space-x-2 flex-shrink-0'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='whitespace-nowrap'>{formatHours(breakHours)} Break</span>
            </div>
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className='flex items-center space-x-2 flex-shrink-0 ml-4'>
          {isPunchedIn && (
            <Button
              onClick={() => isOnBreak ? setShowResumeDialog(true) : setShowBreakDialog(true)}
              variant='outline'
              size='sm'
              className={`${
                isOnBreak 
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              <Coffee className='h-4 w-4 mr-1' />
              <span className='hidden sm:inline'>{isOnBreak ? 'Resume' : 'Take Break'}</span>
            </Button>
          )}
          
          {isPunchedIn && !isOnBreak && (
            <Button
              onClick={() => setShowPunchOutDialog(true)}
              variant='destructive'
              size='sm'
            >
              <LogOut className='h-4 w-4 mr-1' />
              <span className='hidden sm:inline'>Punch Out</span>
            </Button>
          )}
          
          {!isPunchedIn && (
            <Button
              onClick={() => setShowPunchInDialog(true)}
              variant='default'
              size='sm'
            >
              <LogOut className='h-4 w-4 mr-1' />
              <span className='hidden sm:inline'>Punch In</span>
            </Button>
          )}
        </div>
      </div>

      {/* Punch In Confirmation Dialog */}
      <AlertDialog open={showPunchInDialog} onOpenChange={setShowPunchInDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Punch In</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to punch in? This will start tracking your work time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePunchIn}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Punch Out Confirmation Dialog */}
      <AlertDialog open={showPunchOutDialog} onOpenChange={setShowPunchOutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Punch Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to punch out? This will end your work session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePunchOut}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Take Break Confirmation Dialog */}
      <AlertDialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Break</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start your break? This will pause your work time tracking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTakeBreak}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Confirmation Dialog */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resume work? This will end your break and continue time tracking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTakeBreak}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}