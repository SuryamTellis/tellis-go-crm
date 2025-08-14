import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  IconSearch, 
  IconLayoutList, 
  IconLayoutGrid, 
  IconCalendar,
  IconDownload,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react'
import { useState } from 'react'

// Mock attendance data
const attendanceData = [
  {
    id: 1,
    employee: 'Olivia Martin',
    date: '2024-08-01',
    status: 'Present',
    checkIn: '09:01 AM',
    checkOut: '05:58 PM'
  },
  {
    id: 2,
    employee: 'Jackson Lee',
    date: '2024-08-01',
    status: 'Present',
    checkIn: '08:55 AM',
    checkOut: '06:05 PM'
  },
  {
    id: 3,
    employee: 'William Kim',
    date: '2024-08-01',
    status: 'Late',
    checkIn: '09:15 AM',
    checkOut: '05:50 PM'
  },
  {
    id: 4,
    employee: 'Sofia Davis',
    date: '2024-08-01',
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
      return <Badge className='bg-yellow-500 hover:bg-yellow-600'>Late</Badge>
    case 'Absent':
      return <Badge variant='destructive'>Absent</Badge>
    case 'On Leave':
      return <Badge className='bg-blue-500 hover:bg-blue-600'>On Leave</Badge>
    case 'Remote':
      return <Badge className='bg-purple-500 hover:bg-purple-600'>Remote</Badge>
    default:
      return <Badge variant='secondary'>{status}</Badge>
  }
}

export default function AdminAttendance() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [searchTerm, setSearchTerm] = useState('')

  const statusOptions = [
    { label: 'Present', value: 'present', color: 'bg-green-500' },
    { label: 'Absent', value: 'absent', color: 'bg-red-500' },
    { label: 'Late', value: 'late', color: 'bg-yellow-500' },
    { label: 'On Leave', value: 'leave', color: 'bg-blue-500' },
    { label: 'Remote', value: 'remote', color: 'bg-purple-500' }
  ]

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

  const days = getDaysInMonth(currentMonth)

  return (
    <Main>
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Attendance</h2>
          <p className='text-muted-foreground'>
            Review and manage team attendance records.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Filters */}
          <div className='lg:col-span-1 space-y-6'>
            <Card>
              <CardContent className='p-6'>
                <h2 className='text-lg font-semibold mb-4'>Filters</h2>
                
                {/* Date Range */}
                <div className='space-y-2 mb-4'>
                  <label className='text-sm font-medium'>Date Range</label>
                  <div className='relative'>
                    <IconCalendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      placeholder='Jul 31, 2025 - Aug 07, 2025'
                      className='pl-10'
                    />
                  </div>
                  <p className='text-xs text-muted-foreground'>Select a preset</p>
                </div>

                {/* Employees */}
                <div className='space-y-2 mb-4'>
                  <label className='text-sm font-medium'>Employees</label>
                  <Input placeholder='Select employees' />
                </div>

                {/* Status */}
                <div className='space-y-2 mb-6'>
                  <label className='text-sm font-medium'>Status</label>
                  <div className='space-y-2'>
                    {statusOptions.map((status) => (
                      <Button
                        key={status.value}
                        variant={selectedStatus === status.value ? 'default' : 'outline'}
                        size='sm'
                        className={`w-full justify-start ${
                          selectedStatus === status.value ? status.color : ''
                        }`}
                        onClick={() => setSelectedStatus(
                          selectedStatus === status.value ? null : status.value
                        )}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <Button className='w-full bg-black hover:bg-gray-800 text-white'>
                  <IconDownload className='h-4 w-4 mr-2' />
                  Export as CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Table or Calendar */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Search and Controls - Always Visible */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='relative'>
                  <IconSearch className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                  <Input
                    placeholder='Search...'
                    className='pl-10 w-80'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Button 
                  variant='outline' 
                  size='icon'
                  className={viewMode === 'table' ? 'bg-black hover:bg-gray-800 text-white border-black' : ''}
                  onClick={() => setViewMode('table')}
                >
                  <IconLayoutList className='h-4 w-4' />
                </Button>
                <Button 
                  variant='outline' 
                  size='icon'
                  className={viewMode === 'calendar' ? 'bg-black hover:bg-gray-800 text-white border-black' : ''}
                  onClick={() => setViewMode('calendar')}
                >
                  <IconLayoutGrid className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {viewMode === 'table' ? (
              /* Table View */
              <Card>
                <CardContent className='p-6'>
                  {/* Table */}
                  <div className='overflow-x-auto'>
                    <table className='w-full'>
                      <thead>
                        <tr className='border-b bg-muted/50'>
                          <th className='text-left p-4 font-medium'>Employee</th>
                          <th className='text-left p-4 font-medium'>Date</th>
                          <th className='text-left p-4 font-medium'>Status</th>
                          <th className='text-left p-4 font-medium'>Check-in</th>
                          <th className='text-left p-4 font-medium'>Check-out</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceData.map((record) => (
                          <tr key={record.id} className='border-b hover:bg-muted/50'>
                            <td className='p-4 font-medium'>{record.employee}</td>
                            <td className='p-4 text-muted-foreground'>{record.date}</td>
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
            ) : (
              /* Calendar View */
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
                        className={`p-2 text-center text-sm border rounded min-h-[60px] flex items-center justify-center ${
                          day.isCurrentMonth 
                            ? 'bg-card text-foreground' 
                            : 'bg-muted/25 text-muted-foreground'
                        }`}
                      >
                        {formatDate(day.date)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Main>
  )
}