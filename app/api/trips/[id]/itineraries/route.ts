import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { generateMockItinerary } from '@/lib/ai-mock';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('itineraries')
      .select(`
        *,
        days(
          *,
          activities(*)
        )
      `)
      .eq('trip_id', id);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/trips/[id]/itineraries error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch itineraries' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Verify trip ownership
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError || !trip || trip.user_id !== user.id) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { useAI, travelStyle = 'adventure' } = body;

    let itinerary, days;

    if (useAI) {
      // Generate mock itinerary
      const { itinerary: mockItinerary, days: mockDays } = generateMockItinerary({
        destination: trip.title,
        startDate: new Date(trip.start_date),
        endDate: new Date(trip.end_date),
        travelStyle: travelStyle || 'adventure',
        tripId,
      });

      // Insert itinerary
      const { data: createdItinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert(mockItinerary)
        .select()
        .single();

      if (itineraryError) throw itineraryError;

      itinerary = createdItinerary;

      // Insert days with activities
      for (const day of mockDays) {
        const { activities, ...dayData } = day;
        const { data: createdDay, error: dayError } = await supabase
          .from('days')
          .insert({ ...dayData, itinerary_id: itinerary.id })
          .select()
          .single();

        if (dayError) throw dayError;

        // Insert activities for this day
        const activitiesToInsert = activities.map((act) => ({
          ...act,
          day_id: createdDay.id,
        }));

        const { error: activitiesError } = await supabase
          .from('activities')
          .insert(activitiesToInsert);

        if (activitiesError) throw activitiesError;
      }
    } else {
      // Manual itinerary creation
      const { data: createdItinerary, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          trip_id: tripId,
          title: body.title || 'My Itinerary',
          description: body.description,
        })
        .select()
        .single();

      if (itineraryError) throw itineraryError;
      itinerary = createdItinerary;
    }

    return NextResponse.json(itinerary, { status: 201 });
  } catch (error) {
    console.error('POST /api/trips/[id]/itineraries error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create itinerary' } },
      { status: 500 }
    );
  }
}
