import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('trip_id', id)
      .order('date_taken', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/trips/[id]/memories error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch memories' } },
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

    const body = await request.json();
    const { image_url, caption, date_taken } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: { message: 'Image URL is required' } },
        { status: 400 }
      );
    }

    // Verify trip ownership
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip || trip.user_id !== user.id) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from('memories')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        image_url,
        caption,
        date_taken: date_taken || new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/trips/[id]/memories error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create memory' } },
      { status: 500 }
    );
  }
}
