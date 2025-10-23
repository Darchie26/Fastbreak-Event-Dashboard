'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient()

    console.log('🔐 Attempting sign in for:', email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Sign in error:', error.message)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      console.error('❌ No user returned')
      return { success: false, error: 'Invalid credentials' }
    }

    console.log('✅ Sign in successful for:', data.user.id)
    revalidatePath('/', 'layout')
    return { success: true, data: { user: data.user } }
  } catch (error) {
    console.error('💥 Unexpected sign in error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function signUp(email: string, password: string) {
  try {
    const supabase = await createClient()

    console.log('📝 Attempting sign up for:', email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('❌ Sign up error:', error.message)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      console.error('❌ No user returned after signup')
      return { success: false, error: 'Failed to create account' }
    }

    console.log('✅ Sign up successful for:', data.user.id)
    revalidatePath('/', 'layout')
    return { success: true, data: { user: data.user } }
  } catch (error) {
    console.error('💥 Unexpected sign up error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    
    console.log('👋 Signing out')
    
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Sign out error:', error.message)
      return { success: false, error: error.message }
    }

    console.log('✅ Sign out successful')
    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('💥 Unexpected sign out error:', error)
    redirect('/login')
  }
}

export async function getUser() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ Get user error:', error.message)
      return null
    }
    
    return user
  } catch (error) {
    console.error('💥 Unexpected get user error:', error)
    return null
  }
}