import { createClient } from '@/lib/supabase/server'

export async function uploadEventPoster(
  file: File,
  userId: string,
  eventId: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${eventId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('event-posters')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { url: null, error: 'Failed to upload image' }
    }

    const { data } = supabase.storage
      .from('event-posters')
      .getPublicUrl(fileName)

    return { url: data.publicUrl, error: null }
  } catch (error) {
    console.error('Unexpected upload error:', error)
    return { url: null, error: 'An unexpected error occurred during upload' }
  }
}

export async function deleteEventPoster(posterUrl: string): Promise<boolean> {
  try {
    const supabase = await createClient()

    const url = new URL(posterUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts.slice(-2).join('/')

    const { error } = await supabase.storage
      .from('event-posters')
      .remove([fileName])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected delete error:', error)
    return false
  }
}