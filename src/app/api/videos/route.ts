import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from('videos')
      .select('*');

    if (error) throw error;

    console.log('API Fetch: Successfully fetched videos');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('CRITICAL DATABASE ERROR:', error.message);
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message },
      { status: 500 }
    );
  }
}

