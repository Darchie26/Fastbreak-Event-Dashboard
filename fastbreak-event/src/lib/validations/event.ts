import { z } from 'zod'

export const venueSchema = z.object({
  name: z.string().min(1, 'Venue name is required'),
  address: z.string().optional(),
  capacity: z.string().optional(),
})

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Event name is too long'),
  sport_type: z.string().min(1, 'Sport type is required'),
  date_time: z.date({
    message: 'Date and time is required',
  }),
  description: z.string().max(500, 'Description is too long').optional(),
  venues: z.array(venueSchema).min(1, 'At least one venue is required'),
})

export type CreateEventFormData = z.infer<typeof createEventSchema>
export type VenueFormData = z.infer<typeof venueSchema>

export const SPORT_TYPES = [
  'Soccer',
  'Basketball',
  'Tennis',
  'Baseball',
  'Football',
  'Volleyball',
  'Golf',
  'Swimming',
  'Track & Field',
  'Other',
] as const