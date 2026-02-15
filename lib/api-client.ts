import { ApiResponse } from './types';

const API_BASE = '/api';

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'An error occurred',
          code: response.status.toString(),
        },
      };
    }

    return { data };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export const apiClient = {
  // Trips
  getTrips: () => apiCall('/trips'),
  getTrip: (id: string) => apiCall(`/trips/${id}`),
  createTrip: (data: any) => apiCall('/trips', { method: 'POST', body: JSON.stringify(data) }),
  updateTrip: (id: string, data: any) => 
    apiCall(`/trips/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTrip: (id: string) => apiCall(`/trips/${id}`, { method: 'DELETE' }),

  // Itineraries
  getItineraries: (tripId: string) => apiCall(`/trips/${tripId}/itineraries`),
  createItinerary: (tripId: string, data: any) => 
    apiCall(`/trips/${tripId}/itineraries`, { method: 'POST', body: JSON.stringify(data) }),
  updateItinerary: (id: string, data: any) =>
    apiCall(`/itineraries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Activities
  getActivities: (dayId: string) => apiCall(`/days/${dayId}/activities`),
  createActivity: (dayId: string, data: any) =>
    apiCall(`/days/${dayId}/activities`, { method: 'POST', body: JSON.stringify(data) }),
  updateActivity: (id: string, data: any) =>
    apiCall(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteActivity: (id: string) => apiCall(`/activities/${id}`, { method: 'DELETE' }),

  // Memories
  getMemories: (tripId: string) => apiCall(`/trips/${tripId}/memories`),
  createMemory: (tripId: string, data: any) =>
    apiCall(`/trips/${tripId}/memories`, { method: 'POST', body: JSON.stringify(data) }),

  // Destinations
  getDestinations: () => apiCall('/destinations'),
  createDestination: (data: any) => apiCall('/destinations', { method: 'POST', body: JSON.stringify(data) }),
};
