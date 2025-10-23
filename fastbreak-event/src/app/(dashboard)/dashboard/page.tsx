'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import EventList from '@/components/event-list'
import DashboardHeader from '@/components/dashboard-header'
import { ManualBannerCarousel } from '@/components/manual-banner-carousel'
import { SearchBar } from '@/components/search-bar'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserAndEvents() {
      const supabase = createClient()

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Load events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*, venues(*)')
        .order('date_time', { ascending: true })

      setEvents(eventsData || [])
      setLoading(false)
    }

    loadUserAndEvents()
  }, [router])

  const banners = [
    {
      id: '1',
      title: 'Master Your Game at Dilworth Park',
      description: 'Professional coaching for all ages and skill levels. Join us for expert instruction in Charlottes premier outdoor courts.',
      image_url: '/banners/1.png',
      link_url: null,
    },
    {
      id: '2',
      title: 'Its Tailgate Time! Charlotte FC Edition',
      description: 'Kick off the weekend with Charlotte Football Club! Food, drinks, games, and pre-game hype. See you in the lot this Saturday!',
      image_url: '/banners/2.png',
      link_url: null,
    },
    {
      id: '3',
      title: 'Transform Your Fitness Journey with Get Fit CLT',
      description: 'Join Charlottes premier fitness community. Personal training group classes and nutrition coaching designed to help you reach your goals.',
      image_url: '/banners/3.png',
      link_url: null,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <SearchBar />
        <ManualBannerCarousel banners={banners} />

        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            Sports Events
          </h1>
          <p className="text-gray-300">
            Browse and manage all sports events
          </p>
        </div>

        <EventList initialEvents={events} />
      </main>
    </div>
  )
}