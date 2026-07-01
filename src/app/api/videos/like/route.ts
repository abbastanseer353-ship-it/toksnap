import { NextResponse } from 'next/server';
import supabase from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { videoId, userId } = await request.json();

    const { data, error } = await supabase
      .from('likes')
      .insert([{ video_id: videoId, user_id: userId }]);

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('LIKE ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
