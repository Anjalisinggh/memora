import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import { Trip } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /api/trips error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to fetch trips' } },
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
    const { title, description, start_date, end_date, destination_id } = body;

    if (!title || !start_date || !end_date) {
      return NextResponse.json(
        { error: { message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        title,
        description,
        start_date,
        end_date,
        destination_id,
        is_public: false,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('POST /api/trips error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to create trip' } },
      { status: 500 }
    );
  }
}
