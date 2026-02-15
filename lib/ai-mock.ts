import { Itinerary, Day, Activity } from './types';

// Seed-based deterministic generator for consistent results
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const activityTemplates = {
  transportation: [
    { title: 'Flight to destination', duration: 300 },
    { title: 'Airport transfer', duration: 60 },
    { title: 'Train journey', duration: 240 },
  ],
  accommodation: [
    { title: 'Check-in at hotel', duration: 30 },
    { title: 'Rest and relax', duration: 120 },
  ],
  attraction: [
    { title: 'Visit local museum', duration: 120 },
    { title: 'Explore historic district', duration: 180 },
    { title: 'National park hike', duration: 240 },
    { title: 'Beach time', duration: 180 },
    { title: 'Local market tour', duration: 120 },
  ],
  dining: [
    { title: 'Breakfast at local cafe', duration: 60 },
    { title: 'Lunch at famous restaurant', duration: 90 },
    { title: 'Dinner with city views', duration: 120 },
  ],
};

interface GenerateItineraryInput {
  destination: string;
  startDate: Date;
  endDate: Date;
  travelStyle: 'adventure' | 'relaxation' | 'cultural' | 'foodie';
  tripId: string;
}

export function generateMockItinerary(input: GenerateItineraryInput): {
  itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'>;
  days: (Omit<Day, 'id' | 'created_at'> & { activities: Omit<Activity, 'id' | 'created_at' | 'updated_at'>[] })[];
} {
  const { destination, startDate, endDate, travelStyle, tripId } = input;
  
  const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const seed = parseInt(tripId.replace(/\D/g, '')) % 1000;

  const styleDescriptions: Record<string, string> = {
    adventure: 'action-packed activities, outdoor exploration, and thrilling experiences',
    relaxation: 'spa days, beach time, and peaceful moments with scenic views',
    cultural: 'museums, historical sites, local traditions, and cultural immersion',
    foodie: 'culinary tours, local markets, cooking classes, and restaurant experiences',
  };

  const itinerary: Omit<Itinerary, 'id' | 'created_at' | 'updated_at'> = {
    trip_id: tripId,
    title: `${numDays}-Day ${destination} ${travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)} Itinerary`,
    description: `A curated ${numDays}-day itinerary focused on ${styleDescriptions[travelStyle]}.`,
  };

  const days: (Omit<Day, 'id' | 'created_at'> & { 
    activities: Omit<Activity, 'id' | 'created_at' | 'updated_at'>[] 
  })[] = [];

  for (let i = 0; i < numDays; i++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + i);

    const dayActivities: Omit<Activity, 'id' | 'created_at' | 'updated_at'>[] = [];
    const activitiesPerDay = 3 + Math.floor(seededRandom(seed + i) * 2);
    
    const categories: Activity['category'][] = ['accommodation', 'transportation', 'attraction', 'dining', 'other'];
    let currentHour = 8;

    for (let j = 0; j < activitiesPerDay; j++) {
      const categoryIndex = Math.floor(seededRandom(seed + i + j) * categories.length);
      const category = categories[categoryIndex];
      const templates = activityTemplates[category as keyof typeof activityTemplates];
      const template = templates[Math.floor(seededRandom(seed + i + j + 1) * templates.length)];

      const startHour = currentHour;
      const endHour = startHour + Math.ceil(template.duration / 60);

      dayActivities.push({
        day_id: '', // Will be set during DB insertion
        title: template.title,
        description: `Enjoy this ${category} experience during your stay in ${destination}.`,
        start_time: `${String(startHour).padStart(2, '0')}:00`,
        end_time: `${String(Math.min(endHour, 22)).padStart(2, '0')}:00`,
        location: destination,
        category,
      });

      currentHour = Math.min(endHour + 1, 22);
    }

    days.push({
      itinerary_id: '', // Will be set during DB insertion
      day_number: i + 1,
      date: dayDate.toISOString().split('T')[0],
      activities: dayActivities,
    });
  }

  return { itinerary, days };
}
