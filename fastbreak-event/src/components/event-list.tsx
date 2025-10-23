'use client'

import EventCard from '@/components/event-card'
import { Button } from '@/components/ui/button'
import type { EventWithVenues } from '@/types/database'

interface EventListProps {
  initialEvents: EventWithVenues[]
}

export default function EventList({ initialEvents }: EventListProps) {
  if (initialEvents.length === 0) {
    return (
      <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-lg border border-[#17f2e3]/20">
        <p className="text-gray-400 mb-4">No events found</p>
        <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}