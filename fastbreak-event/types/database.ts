export interface Event {
    id: string
    user_id: string
    name: string
    sport_type: string
    date_time: string
    description: string | null
    poster_url: string | null
    created_at: string
    updated_at: string
  }
  
  export interface Venue {
    id: string
    event_id: string
    name: string
    address: string | null
    capacity: number | null
    created_at: string
  }
  
  export interface EventWithVenues extends Event {
    venues: Venue[]
  }