'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateTimePicker } from '@/components/date-time-picker'
import { ImageUpload } from '@/components/image-upload'

import { createEventWithoutPoster } from '../../../../../actions/event'
import { 
  createEventSchema, 
  type CreateEventFormData,
  SPORT_TYPES 
} from '@/lib/validations/event'

export default function CreateEventPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [posterFile, setPosterFile] = useState<File | undefined>(undefined)
  const router = useRouter()

  const form = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: '',
      sport_type: '',
      date_time: undefined,
      description: '',
      poster: undefined,
      posterFileName: undefined,
      posterFileType: undefined,
      venues: [{ name: '', address: '', capacity: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'venues',
  })

  // Upload poster directly to Supabase Storage
  async function uploadPosterDirectly(
    file: File, 
    userId: string, 
    eventId: string
  ): Promise<string | null> {
    try {
      const supabase = createClient()
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${eventId}-${Date.now()}.${fileExt}`

      console.log('📤 Uploading image to storage...')

      const { error: uploadError } = await supabase.storage
        .from('Sports Events Management')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('❌ Upload error:', uploadError)
        throw new Error(uploadError.message)
      }

      const { data } = supabase.storage
        .from('Sports Events Management')
        .getPublicUrl(fileName)

      console.log('✅ Image uploaded successfully')
      return data.publicUrl
    } catch (error) {
      console.error('💥 Upload failed:', error)
      return null
    }
  }

  async function onSubmit(data: CreateEventFormData) {
    setIsLoading(true)

    try {
      console.log('📝 Starting event creation...')

      // Validate poster file if exists
      if (posterFile) {
        if (posterFile.size > 5 * 1024 * 1024) {
          toast.error('Image must be less than 5MB')
          setIsLoading(false)
          return
        }

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!validTypes.includes(posterFile.type)) {
          toast.error('Only JPG, PNG and WEBP images are supported')
          setIsLoading(false)
          return
        }
      }

      // Step 1: Create event in database (without poster)
      console.log('📤 Creating event in database...')
      const result = await createEventWithoutPoster({
        name: data.name,
        sport_type: data.sport_type,
        date_time: data.date_time,
        description: data.description,
        venues: data.venues,
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      console.log('✅ Event created with ID:', result.data.id)

      // Step 2: Upload poster if exists
      if (posterFile && result.data.id) {
        console.log('📸 Uploading poster...')
        
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const posterUrl = await uploadPosterDirectly(
            posterFile, 
            user.id, 
            result.data.id
          )
          
          if (posterUrl) {
            // Step 3: Update event with poster URL
            console.log('🔄 Updating event with poster URL...')
            const { error: updateError } = await supabase
              .from('events')
              .update({ poster_url: posterUrl })
              .eq('id', result.data.id)
            
            if (updateError) {
              console.error('⚠️ Failed to update poster URL:', updateError)
              toast.warning('Event created but poster upload had issues')
            } else {
              console.log('✅ Poster URL updated successfully')
            }
          } else {
            toast.warning('Event created but poster upload failed')
          }
        }
      }

      toast.success('Event created successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('💥 Error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4 text-gray-300 hover:text-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="bg-white/5 backdrop-blur-md border-[#17f2e3]/20">
          <CardHeader>
            <CardTitle className="text-3xl font-black text-white">
              Create New Event
            </CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the details below to create a new sports event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Event Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Event Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Summer Basketball Tournament"
                          disabled={isLoading}
                          className="bg-white/10 border-[#17f2e3]/30 text-white placeholder:text-gray-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Event Poster */}
                <FormField
                  control={form.control}
                  name="poster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Event Poster</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={posterFile}
                          onChange={(file) => {
                            setPosterFile(file)
                            field.onChange(file ? 'has-file' : undefined)
                          }}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Upload a poster or banner for your event (optional, max 5MB)
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Sport Type */}
                <FormField
                  control={form.control}
                  name="sport_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Sport Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white/10 border-[#17f2e3]/30 text-white">
                            <SelectValue placeholder="Select a sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-[#17f2e3]/30">
                          {SPORT_TYPES.map((sport) => (
                            <SelectItem key={sport} value={sport} className="text-white hover:bg-[#17f2e3]/20">
                              {sport}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Date & Time */}
                <FormField
                  control={form.control}
                  name="date_time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Date & Time *</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your event..."
                          className="resize-none bg-white/10 border-[#17f2e3]/30 text-white placeholder:text-gray-500"
                          rows={4}
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Optional - Max 500 characters
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Venues Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <FormLabel className="text-base text-white">Venues *</FormLabel>
                      <FormDescription className="text-gray-400">
                        Add one or more venues for this event
                      </FormDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: '', address: '', capacity: '' })}
                      disabled={isLoading}
                      className="border-[#17f2e3]/30 text-gray-300 hover:bg-[#17f2e3]/10"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Venue
                    </Button>
                  </div>

                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 bg-white/5 border-[#17f2e3]/20">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-white">
                            Venue {index + 1}
                          </h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              disabled={isLoading}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`venues.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Venue Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., City Sports Arena"
                                  disabled={isLoading}
                                  className="bg-white/10 border-[#17f2e3]/30 text-white placeholder:text-gray-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`venues.${index}.address`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main St, City, State"
                                  disabled={isLoading}
                                  className="bg-white/10 border-[#17f2e3]/30 text-white placeholder:text-gray-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`venues.${index}.capacity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Capacity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 500"
                                  disabled={isLoading}
                                  className="bg-white/10 border-[#17f2e3]/30 text-white placeholder:text-gray-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#17f2e3] hover:bg-[#13cfc2] text-gray-900 font-semibold"
                  >
                    {isLoading ? 'Creating Event...' : 'Create Event'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    disabled={isLoading}
                    className="border-[#17f2e3]/30 text-gray-300 hover:bg-[#17f2e3]/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}