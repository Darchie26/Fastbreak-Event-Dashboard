'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  type ActionResponse, 
  successResponse, 
  errorResponse 
} from '@/lib/action-response'
import { deleteEventPoster } from '@/lib/upload-image'
import type { EventWithVenues } from '@/types/database'

export async function getEvents(
  searchQuery?: string,
  sportFilter?: string
): Promise<ActionResponse<EventWithVenues[]>> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('events')
      .select(`
        *,
        venues (*)
      `)
      .order('date_time', { ascending: true })

    // Apply search filter
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    // Apply sport filter
    if (sportFilter && sportFilter !== 'all') {
      query = query.eq('sport_type', sportFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching events:', error)
      return errorResponse('Failed to fetch events')
    }

    return successResponse(data as EventWithVenues[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return errorResponse('An unexpected error occurred')
  }
}

export async function getEventById(
  id: string
): Promise<ActionResponse<EventWithVenues>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        venues (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return errorResponse('Event not found')
    }

    return successResponse(data as EventWithVenues)
  } catch (error) {
    console.error('Unexpected error:', error)
    return errorResponse('An unexpected error occurred')
  }
}

export async function deleteEvent(id: string): Promise<ActionResponse<void>> {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return errorResponse('You must be logged in to delete events')
    }

    // Get event to check if it has a poster
    const { data: event } = await supabase
      .from('events')
      .select('poster_url')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    // Delete poster if exists
    if (event?.poster_url) {
      await deleteEventPoster(event.poster_url)
    }

    // Delete event (venues will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return errorResponse('Failed to delete event')
    }

    revalidatePath('/dashboard')
    return successResponse(undefined)
  } catch (error) {
    console.error('Unexpected error:', error)
    return errorResponse('An unexpected error occurred')
  }
}