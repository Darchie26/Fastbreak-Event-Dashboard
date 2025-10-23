import { redirect } from 'next/navigation'
import { getUser } from '../../../../actions/auth'
import { getEvents } from '../../../../actions/event'
import EventList from '@/components/event-list'
import DashboardHeader from '@/components/dashboard-header'
import { ManualBannerCarousel } from '@/components/manual-banner-carousel'
import { SearchBar } from '@/components/search-bar'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sport?: string }>
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  // Await searchParams
  const params = await searchParams
  
  const result = await getEvents(params.search, params.sport)

  const events = result.success ? result.data : []

  // Manually define your banners here
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar />

        {/* Banner Carousel */}
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