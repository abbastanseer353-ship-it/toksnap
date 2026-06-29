import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: '444632581763345',
  api_secret: '2EM3gmYl4vCBQF_eLvN7MK40vj4'
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const userId = formData.get('userId') || '1'; // Default user ID for testing
    const caption = formData.get('caption') || 'My TokSnap video!';

    if (!file) {
      return NextResponse.json({ error: 'No video file found' }, { status: 400 });
    }

    // Convert file to arrayBuffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'toksnap_videos' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const videoUrl = uploadResult.secure_url;

    // Save to MySQL Database
    const [result] = await pool.execute(
      'INSERT INTO videos (user_id, video_url, caption, created_at) VALUES (?, ?, ?, NOW())',
      [userId, videoUrl, caption]
    );

    return NextResponse.json({ success: true, url: videoUrl, dbResult: result });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}