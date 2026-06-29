
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch all videos from the database, ordered by newest first
    const [rows] = await pool.execute('SELECT * FROM videos ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
