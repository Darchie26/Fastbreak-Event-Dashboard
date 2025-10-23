import { redirect } from 'next/navigation'
import { getUser } from '../../../../actions/auth'
import { getEvents } from '../../../../actions/event'
import EventList from '@/components/event-list'
import DashboardHeader from '@/components/dashboard-header'
import { ManualBannerCarousel } from '@/components/manual-banner-carousel'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { search?: string; sport?: string }
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const result = await getEvents(searchParams.search, searchParams.sport)

  const events = result.success ? result.data : []

  // Manually define your banners here
  const banners = [
    {
      id: '1',
      title: 'Master Your Game at Dilworth Park',
      description: 'Register now for the 2025 Summer Basketball League. Open to all skill levels.',
      image_url: '/banners/1.png',
      link_url: null,
    },
    {
      id: '2',
      title: 'Upcoming Tennis Tournament',
      description: 'Join us for the Annual City Tennis Championship this weekend.',
      image_url: '/banners/2.png',
      link_url: null,
    },
    {
      id: '3',
      title: 'New Sports Facilities Open Now',
      description: 'Check out our brand new state-of-the-art facilities and book your court today!',
      image_url: '/banners/new-facilities.jpg',
      link_url: 'https://example.com/facilities',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-4 py-8">
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