import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: { message: 'Trip not found' } },
        { status: 404 }
      );
    }

    // Check if user has access
    if (data.user_id !== user?.id && !data.is_public) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 403 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/trips/[id] error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch trip' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Check ownership
    const { data: trip, error: fetchError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !trip || trip.user_id !== user.id) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { data, error } = await supabase
      .from('trips')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT /api/trips/[id] error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to update trip' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Check ownership
    const { data: trip, error: fetchError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !trip || trip.user_id !== user.id) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/trips/[id] error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to delete trip' } },
      { status: 500 }
    );
  }
}
