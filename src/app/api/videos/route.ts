import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Attempt to fetch data
    const [rows] = await pool.execute('SELECT * FROM videos ORDER BY created_at DESC');
    
    // Log the result for debugging in the server console
    console.log(`API Fetch: Successfully retrieved ${Array.isArray(rows) ? rows.length : 0} videos.`);
    
    return NextResponse.json(rows);
  } catch (error: any) {
    // Log detailed error to server console
    console.error('CRITICAL DATABASE ERROR:', error);
    
    return NextResponse.json(
      { error: 'Database connection failed', details: error.message }, 
      { status: 500 }
    );
  }
}
