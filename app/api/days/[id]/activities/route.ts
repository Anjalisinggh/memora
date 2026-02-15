import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('day_id', id)
      .order('start_time', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/days/[id]/activities error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch activities' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: dayId } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, start_time, end_time, location, category } = body;

    if (!title || !start_time || !end_time || !category) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Verify user owns the trip this day belongs to
    const { data: day } = await supabase
      .from('days')
      .select('itinerary_id')
      .eq('id', dayId)
      .single();

    if (!day) {
      return NextResponse.json(
        { error: { message: 'Day not found' } },
        { status: 404 }
      );
    }

    const { data: itinerary } = await supabase
      .from('itineraries')
      .select('trip_id')
      .eq('id', day.itinerary_id)
      .single();

    const { data: trip } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', itinerary.trip_id)
      .single();

    if (trip.user_id !== user.id) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('activities')
      .insert({
        day_id: dayId,
        title,
        description,
        start_time,
        end_time,
        location,
        category,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/days/[id]/activities error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create activity' } },
      { status: 500 }
    );
  }
}
