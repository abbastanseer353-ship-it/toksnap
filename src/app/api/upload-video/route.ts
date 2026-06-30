
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const userId = formData.get('userId') || 'anon_user'; 
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

    // Save to Supabase (Replacing MySQL)
    const { data, error } = await supabase
      .from('videos')
      .insert([
        { 
          user_id: userId, 
          video_url: videoUrl, 
          caption: caption,
          likes_count: 0
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, url: videoUrl, data });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
