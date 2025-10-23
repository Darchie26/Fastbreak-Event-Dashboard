'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EventCard from '@/components/event-card'
import { Search } from 'lucide-react'
import type { EventWithVenues } from '@/types/database'

const SPORT_TYPES = [
  'All Sports',
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
]

interface EventListProps {
  initialEvents: EventWithVenues[]
}

export default function EventList({ initialEvents }: EventListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [sportFilter, setSportFilter] = useState(searchParams.get('sport') || 'all')

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (sportFilter && sportFilter !== 'all') params.set('sport', sportFilter)

      router.push(`/dashboard?${params.toString()}`)
    })
  }

  const handleReset = () => {
    setSearchQuery('')
    setSportFilter('all')
    startTransition(() => {
      router.push('/dashboard')
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar - Glassmorphism */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-[#17f2e3]/20 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#17f2e3] h-4 w-4" />
            <Input
              type="text"
              placeholder="Search events by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 bg-white/10 border-[#17f2e3]/30 text-white placeholder:text-gray-400 focus:border-[#17f2e3] focus:ring-[#17f2e3]"
            />
          </div>

          {/* Sport Filter */}
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/10 border-[#17f2e3]/30 text-white">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-[#17f2e3]/30">
              <SelectItem value="all" className="text-white hover:bg-[#17f2e3]/20">All Sports</SelectItem>
              {SPORT_TYPES.slice(1).map((sport) => (
                <SelectItem key={sport} value={sport} className="text-white hover:bg-[#17f2e3]/20">
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={isPending}
              className="bg-[#17f2e3] hover:bg-[#13cfc2] text-gray-900 font-semibold"
            >
              {isPending ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              onClick={handleReset} 
              variant="outline"
              disabled={isPending}
              className="border-[#17f2e3]/30 text-gray-300 hover:bg-[#17f2e3]/10 hover:text-white"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isPending ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading events...</p>
        </div>
      ) : initialEvents.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-lg border border-[#17f2e3]/20">
          <p className="text-gray-400 mb-4">No events found</p>
          <Button onClick={handleReset} variant="outline" className="border-[#17f2e3]/30 text-gray-300 hover:bg-[#17f2e3]/10">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}