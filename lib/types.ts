// Auth
export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

// Trip
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  destination_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// Destination
export interface Destination {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  description?: string;
  image_url?: string;
  created_at: string;
}

// Itinerary
export interface Itinerary {
  id: string;
  trip_id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Day (within itinerary)
export interface Day {
  id: string;
  itinerary_id: string;
  day_number: number;
  date: string;
  created_at: string;
}

// Activity
export interface Activity {
  id: string;
  day_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  category: 'transportation' | 'accommodation' | 'attraction' | 'dining' | 'other';
  created_at: string;
  updated_at: string;
}

// Memory (photos from trip)
export interface Memory {
  id: string;
  trip_id: string;
  user_id: string;
  image_url: string;
  caption?: string;
  date_taken: string;
  created_at: string;
}

// Collaborator
export interface Collaborator {
  id: string;
  trip_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  created_at: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}
