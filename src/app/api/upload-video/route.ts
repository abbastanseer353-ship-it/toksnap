
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const userId = formData.get('userId') || 'anon_user'; 
    const caption = formData.get('caption') || 'My TokSnap!';

    if (!file) {
      return NextResponse.json({ error: 'No file selected' }, { status: 400 });
    }

    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Ensure we are uploading to the 'videos' bucket
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
        error: `Storage Error: ${uploadError.message}. Make sure the "videos" bucket exists and has a Public Policy (INSERT allowed).` 
      }, { status: 500 });
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('videos')
      .getPublicUrl(filePath);

    // 3. Save to Database
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
      // Even if DB fails, the file is uploaded. You might want to delete it or just report error.
      return NextResponse.json({ 
        error: `Database Error: ${dbError.message}. Ensure the RLS Policy for "videos" table allows INSERT.` 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: publicUrl, data: dbData });
  } catch (error: any) {
    console.error('Critical Upload Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Something went wrong during upload' 
    }, { status: 500 });
  }
}
