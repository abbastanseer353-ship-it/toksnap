
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { videoId, increment } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    // Attempt to update the likes_count column. 
    // Note: This assumes you have added a 'likes_count' column to your 'videos' table.
    // SQL: ALTER TABLE videos ADD COLUMN likes_count INT DEFAULT 0;
    const [result] = await pool.execute(
      'UPDATE videos SET likes_count = GREATEST(0, likes_count + ?) WHERE id = ?',
      [increment, videoId]
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Like Update Error:', error);
    return NextResponse.json({ error: 'Failed to update like count', details: error.message }, { status: 500 });
  }
}
