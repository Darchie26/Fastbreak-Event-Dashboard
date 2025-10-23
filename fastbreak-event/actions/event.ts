'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  type ActionResponse, 
  successResponse, 
  errorResponse 
} from '@/lib/action-response'
import { uploadEventPoster, deleteEventPoster } from '@/lib/upload-image'
import type { CreateEventFormData } from '@/lib/validations/event'
import type { Event, EventWithVenues } from '@/types/database'

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

export async function createEvent(
  formData: CreateEventFormData
): Promise<ActionResponse<{ id: string }>> {
  try {
    console.log('🚀 createEvent called')

    const supabase = await createClient()
    console.log('✅ Supabase client created')

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('❌ No authenticated user')
      return errorResponse('You must be logged in to create events')
    }

    console.log('✅ User authenticated:', user.id)

    // Create event first
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        name: formData.name,
        sport_type: formData.sport_type,
        date_time: formData.date_time.toISOString(),
        description: formData.description || null,
        poster_url: null,
      })
      .select()
      .single()

    if (eventError || !event) {
      console.error('❌ Error creating event:', eventError)
      return errorResponse('Failed to create event: ' + eventError?.message)
    }

    console.log('✅ Event created with ID:', event.id)

    // Handle poster upload if base64 exists
    let posterUrl: string | null = null
    if (formData.poster && formData.poster.startsWith('data:image')) {
      console.log('📤 Processing poster upload...')
      
      try {
        // Extract base64 data
        const base64Data = formData.poster.split(',')[1]
        const mimeType = formData.posterFileType || 'image/jpeg'
        const fileName = formData.posterFileName || 'poster.jpg'
        
        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64')
        
        // Create a File object
        const file = new File([buffer], fileName, { type: mimeType })
        
        console.log('📸 Uploading file:', { 
          name: fileName, 
          type: mimeType, 
          size: buffer.length 
        })
        
        const { url, error: uploadError } = await uploadEventPoster(
          file,
          user.id,
          event.id
        )

        if (uploadError) {
          console.error('❌ Poster upload failed:', uploadError)
          // Continue without poster
        } else {
          posterUrl = url
          console.log('✅ Poster uploaded:', posterUrl)

          // Update event with poster URL
          await supabase
            .from('events')
            .update({ poster_url: posterUrl })
            .eq('id', event.id)
          
          console.log('✅ Event updated with poster URL')
        }
      } catch (uploadErr) {
        console.error('⚠️ Poster upload error:', uploadErr)
        // Continue without poster
      }
    } else {
      console.log('ℹ️ No poster to upload')
    }

    // Create venues
    const venuesData = formData.venues.map(venue => ({
      event_id: event.id,
      name: venue.name,
      address: venue.address || null,
      capacity: venue.capacity || null,
    }))

    console.log('📍 Creating venues:', venuesData.length)

    const { error: venuesError } = await supabase
      .from('venues')
      .insert(venuesData)

    if (venuesError) {
      console.error('❌ Error creating venues:', venuesError)
      // Rollback
      await supabase.from('events').delete().eq('id', event.id)
      if (posterUrl) {
        await deleteEventPoster(posterUrl)
      }
      return errorResponse('Failed to create event venues: ' + venuesError.message)
    }

    console.log('✅ Venues created successfully')
    console.log('🎉 Event creation complete!')

    revalidatePath('/dashboard')
    return successResponse({ id: event.id })
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return errorResponse('An unexpected error occurred: ' + (error as Error).message)
  }
}

// New function for creating event without handling poster upload
// Poster will be uploaded directly from client
export async function createEventWithoutPoster(
  formData: Omit<CreateEventFormData, 'poster' | 'posterFileName' | 'posterFileType'>
): Promise<ActionResponse<{ id: string }>> {
  try {
    console.log('🚀 createEventWithoutPoster called')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('❌ No authenticated user')
      return errorResponse('You must be logged in to create events')
    }

    console.log('✅ User authenticated:', user.id)

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        user_id: user.id,
        name: formData.name,
        sport_type: formData.sport_type,
        date_time: formData.date_time.toISOString(),
        description: formData.description || null,
        poster_url: null,
      })
      .select()
      .single()

    if (eventError || !event) {
      console.error('❌ Error creating event:', eventError)
      return errorResponse('Failed to create event: ' + eventError?.message)
    }

    console.log('✅ Event created with ID:', event.id)

    // Create venues
    const venuesData = formData.venues.map(venue => ({
      event_id: event.id,
      name: venue.name,
      address: venue.address || null,
      capacity: venue.capacity || null,
    }))

    console.log('📍 Creating venues:', venuesData.length)

    const { error: venuesError } = await supabase
      .from('venues')
      .insert(venuesData)

    if (venuesError) {
      console.error('❌ Error creating venues:', venuesError)
      // Rollback: delete the event
      await supabase.from('events').delete().eq('id', event.id)
      return errorResponse('Failed to create event venues: ' + venuesError.message)
    }

    console.log('✅ Venues created successfully')
    console.log('🎉 Event creation complete!')

    revalidatePath('/dashboard')
    return successResponse({ id: event.id })
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return errorResponse('An unexpected error occurred: ' + (error as Error).message)
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