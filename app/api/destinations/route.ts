import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/destinations error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch destinations' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, country, latitude, longitude, description, image_url } = body;

    if (!name || !country || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('destinations')
      .insert({
        name,
        country,
        latitude,
        longitude,
        description,
        image_url,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/destinations error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create destination' } },
      { status: 500 }
    );
  }
}
