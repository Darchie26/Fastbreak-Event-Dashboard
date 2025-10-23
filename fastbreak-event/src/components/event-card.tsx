'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Calendar, MapPin, Trash2, Edit } from 'lucide-react'
import { deleteEvent } from '../../actions/event'
import type { EventWithVenues } from '@/types/database'

interface EventCardProps {
  event: EventWithVenues
}

export default function EventCard({ event }: EventCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const result = await deleteEvent(event.id)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('Event deleted successfully')
      setShowDeleteDialog(false)
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete event')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card className="hover:shadow-2xl transition-all duration-300 bg-white/5 backdrop-blur-md border-[#17f2e3]/20 hover:border-[#17f2e3]/50">
        <CardHeader className="p-0">
          {/* Event Poster */}
          {event.poster_url ? (
            <div className="relative w-full aspect-video">
              <Image
                src={event.poster_url}
                alt={event.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-[#17f2e3]/20 to-[#17f2e3]/5 rounded-t-lg flex items-center justify-center border-b border-[#17f2e3]/20">
              <span className="text-[#17f2e3] text-6xl font-black opacity-30">
                {event.sport_type[0]}
              </span>
            </div>
          )}
          
          <div className="p-6 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-white">
                  {event.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  <span className="inline-block bg-[#17f2e3]/20 text-[#17f2e3] text-xs font-semibold px-2.5 py-0.5 rounded border border-[#17f2e3]/30">
                    {event.sport_type}
                  </span>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-gray-300">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-[#17f2e3]" />
            {format(new Date(event.date_time), 'PPp')}
          </div>

          {event.venues && event.venues.length > 0 && (
            <div className="flex items-start text-sm">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-[#17f2e3]" />
              <div>
                <p className="font-medium text-white">{event.venues[0].name}</p>
                {event.venues.length > 1 && (
                  <p className="text-xs text-gray-400">
                    +{event.venues.length - 1} more venue(s)
                  </p>
                )}
              </div>
            </div>
          )}

          {event.description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {event.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 border-t border-[#17f2e3]/10 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-[#17f2e3]/30 text-gray-300 hover:bg-[#17f2e3]/10 hover:text-white"
            onClick={() => router.push(`/events/${event.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-[#17f2e3]/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{event.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700 border-[#17f2e3]/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 