
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const userId = formData.get('userId') || 'anon_user'; 
    const caption = formData.get('caption') || 'My TokSnap video!';

    if (!file) {
      return NextResponse.json({ error: 'No file selected' }, { status: 400 });
    }

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get Public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from('videos')
      .getPublicUrl(filePath);

    // 3. Save metadata to Supabase 'videos' table
    const { data: dbData, error: dbError } = await supabase
      .from('videos')
      .insert([
        { 
          user_id: userId, 
          video_url: publicUrl, 
          caption: caption,
          likes_count: 0
        }
      ])
      .select();

    if (dbError) {
      throw dbError;
    }

    return NextResponse.json({ success: true, url: publicUrl, data: dbData });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Something went wrong during upload' 
    }, { status: 500 });
  }
}
