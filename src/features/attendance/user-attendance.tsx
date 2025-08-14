import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  IconChevronLeft,
  IconChevronRight,
  IconArrowRight as _IconArrowRight
} from '@tabler/icons-react'
import { useState } from 'react'

// Mock attendance data
const attendanceLog = [
  {
    date: '2024-07-29',
    status: 'Present',
    checkIn: '09:01 AM',
    checkOut: '05:58 PM'
  },
  {
    date: '2024-07-28',
    status: 'Present',
    checkIn: '08:55 AM',
    checkOut: '06:05 PM'
  },
  {
    date: '2024-07-27',
    status: 'Weekend',
    checkIn: '-',
    checkOut: '-'
  },
  {
    date: '2024-07-26',
    status: 'Weekend',
    checkIn: '-',
    checkOut: '-'
  },
  {
    date: '2024-07-25',
    status: 'Present',
    checkIn: '09:05 AM',
    checkOut: '06:00 PM'
  },
  {
    date: '2024-07-24',
    status: 'Late',
    checkIn: '09:15 AM',
    checkOut: '05:50 PM'
  },
  {
    date: '2024-07-23',
    status: 'Present',
    checkIn: '08:59 AM',
    checkOut: '06:02 PM'
  }
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Present':
      return <Badge className='bg-green-500 hover:bg-green-600'>Present</Badge>
    case 'Late':
      return <Badge variant='destructive'>Late</Badge>
    case 'Weekend':
      return <Badge variant='secondary'>Weekend</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

export default function UserAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 7, 3)) // August 3rd

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add previous month's days
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      })
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }
    
    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const formatDate = (date: Date) => {
    return date.getDate()
  }

  const isSelectedDate = (date: Date) => {
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear()
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <Main>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>My Attendance</h2>
          <p className='text-muted-foreground'>
            View your personal attendance record.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Calendar and Summary */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Calendar */}
            <Card>
              <CardContent className='p-6'>
                {/* Calendar Header */}
                <div className='flex items-center justify-between mb-6'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <IconChevronLeft className='h-4 w-4' />
                  </Button>
                  
                  <h2 className='text-lg font-semibold'>{formatMonth(currentMonth)}</h2>
                  
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <IconChevronRight className='h-4 w-4' />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className='grid grid-cols-7 gap-1'>
                  {/* Day Headers */}
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className='p-2 text-center text-sm font-medium text-muted-foreground'>
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`p-2 text-center text-sm border rounded min-h-[60px] flex items-center justify-center cursor-pointer hover:bg-muted/50 ${
                        isSelectedDate(day.date) 
                          ? 'bg-black text-white' 
                          : day.isCurrentMonth 
                            ? 'bg-card text-foreground' 
                            : 'bg-muted/25 text-muted-foreground'
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      {formatDate(day.date)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-lg font-semibold mb-4'>Monthly Summary</h2>
                <p className='text-sm text-muted-foreground mb-4'>July 2024</p>
                
                <div className='space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Working Days:</span>
                    <span className='font-medium'>22</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Days Present:</span>
                    <span className='font-medium text-green-500'>20</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Days Late:</span>
                    <span className='font-medium text-red-500'>1</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>Days Absent:</span>
                    <span className='font-medium text-red-500'>1</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-sm'>On-Time Rate:</span>
                    <span className='font-medium text-green-500'>95.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Attendance Log */}
          <div className='lg:col-span-2'>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-lg font-semibold mb-4'>Attendance Log</h2>
                <p className='text-sm text-muted-foreground mb-6'>Your check-in and check-out history.</p>
                
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b bg-muted/50'>
                        <th className='text-left p-4 font-medium'>Date</th>
                        <th className='text-left p-4 font-medium'>Status</th>
                        <th className='text-left p-4 font-medium'>Check-in</th>
                        <th className='text-left p-4 font-medium'>Check-out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceLog.map((record, index) => (
                        <tr key={index} className='border-b hover:bg-muted/50'>
                          <td className='p-4 font-medium'>{record.date}</td>
                          <td className='p-4'>
                            {getStatusBadge(record.status)}
                          </td>
                          <td className='p-4 text-muted-foreground'>{record.checkIn}</td>
                          <td className='p-4 text-muted-foreground'>{record.checkOut}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Main>
  )
}