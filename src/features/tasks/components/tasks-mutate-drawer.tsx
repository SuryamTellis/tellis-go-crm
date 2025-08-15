import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Task } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().optional(),
  assignees: z.string().optional(),
  labels: z.string().optional(),
  priority: z.string().min(1, 'Please choose a priority.'),
})
type TasksForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<TasksForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      description: '',
      assignees: '',
      labels: '',
      priority: '',
    },
  })

  const onSubmit = (data: TasksForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <DialogContent className='max-w-5xl w-full p-8'>
        <DialogHeader className='text-left'>
          <DialogTitle>Create a new task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Left Column - Task Details */}
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className='text-sm font-medium'>Add a title *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Title' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className='text-sm font-medium'>Add a description</FormLabel>
                      <div className='border rounded-md'>
                        <div className='border-b px-3 py-2'>
                          <div className='flex space-x-4 text-sm'>
                            <button type='button' className='font-bold'>Write</button>
                            <button type='button' className='text-muted-foreground'>Preview</button>
                          </div>
                        </div>
                        <div className='border-b px-3 py-2'>
                          <div className='flex space-x-2 text-sm'>
                            <button type='button' className='font-bold'>B</button>
                            <button type='button' className='italic'>I</button>
                            <button type='button'>🔗</button>
                            <button type='button'>&lt;&gt;</button>
                            <button type='button'>•</button>
                            <button type='button'>1.</button>
                            <button type='button'>@</button>
                          </div>
                        </div>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder='Type your description here...'
                            className='border-0 resize-none min-h-[120px]'
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Task Attributes */}
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='assignees'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <FormLabel className='text-sm font-medium'>Assignees</FormLabel>
                        <button type='button' className='text-muted-foreground'>⚙️</button>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Jackson Lee' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='jackson-lee'>Jackson Lee</SelectItem>
                            <SelectItem value='sarah-wilson'>Sarah Wilson</SelectItem>
                            <SelectItem value='mike-chen'>Mike Chen</SelectItem>
                            <SelectItem value='emma-davis'>Emma Davis</SelectItem>
                            <SelectItem value='john-smith'>John Smith</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='labels'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <FormLabel className='text-sm font-medium'>Labels</FormLabel>
                        <button type='button' className='text-muted-foreground'>⚙️</button>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='None yet' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='documentation'>Documentation</SelectItem>
                            <SelectItem value='feature'>Feature</SelectItem>
                            <SelectItem value='bug'>Bug</SelectItem>
                            <SelectItem value='enhancement'>Enhancement</SelectItem>
                            <SelectItem value='design'>Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <FormLabel className='text-sm font-medium'>Priority</FormLabel>
                        <button type='button' className='text-muted-foreground'>⚙️</button>
                      </div>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Select priority' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='high'>High</SelectItem>
                            <SelectItem value='medium'>Medium</SelectItem>
                            <SelectItem value='low'>Low</SelectItem>
                            <SelectItem value='urgent'>Urgent</SelectItem>
                            <SelectItem value='normal'>Normal</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <div className='flex items-center space-x-2'>
            <Checkbox id='create-more' />
            <label htmlFor='create-more' className='text-sm'>Create more</label>
          </div>
          <div className='flex space-x-2'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button form='tasks-form' type='submit' className='bg-green-500 hover:bg-green-600'>
              Create
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
