'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ActionResponse, successResponse, errorResponse } from '@/lib/action-response'

export async function signUp(
  email: string,
  password: string
): Promise<ActionResponse<{ userId: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return errorResponse(error.message)
  }

  if (!data.user) {
    return errorResponse('Failed to create user')
  }

  revalidatePath('/', 'layout')
  return successResponse({ userId: data.user.id })
}

export async function signIn(
  email: string,
  password: string
): Promise<ActionResponse<{ userId: string }>> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return errorResponse(error.message)
  }

  if (!data.user) {
    return errorResponse('Login failed')
  }

  revalidatePath('/', 'layout')
  return successResponse({ userId: data.user.id })
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}