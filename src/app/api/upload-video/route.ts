
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const userId = formData.get('userId') || 'user_' + Math.floor(Math.random() * 10000);
    const caption = formData.get('caption') || 'My TokSnap!';

    if (!file) {
      return NextResponse.json({ error: 'Please select a video or photo.' }, { status: 400 });
    }

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError);
      return NextResponse.json({ 
        error: `Upload failed: ${uploadError.message}. Make sure the "videos" bucket exists and is Public.` 
      }, { status: 500 });
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('videos')
      .getPublicUrl(filePath);

    // 3. Save metadata to Database
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
      console.error('Database Insert Error:', dbError);
      return NextResponse.json({ 
        error: `Database error: ${dbError.message}. Make sure RLS Policies are set to allow Insert.` 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl, data: dbData });
  } catch (error: any) {
    console.error('Critical Upload Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Something went wrong.' 
    }, { status: 500 });
  }
}
