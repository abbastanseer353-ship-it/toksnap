
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Video, X, Loader2, Sparkles, Tag, ArrowLeft, Upload, Type } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { generateImageMetadata } from "@/ai/flows/generate-image-metadata";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metadata, setMetadata] = useState<{ altText: string; tags: string[] } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const isVideo = selectedFile.type.startsWith('video/');
      setFileType(isVideo ? 'video' : 'image');
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setPreview(dataUri);
        
        // Only run AI analysis for images
        if (!isVideo) {
          setIsAnalyzing(true);
          try {
            const result = await generateImageMetadata({ photoDataUri: dataUri });
            setMetadata(result);
            if (!caption) setCaption(result.altText);
          } catch (error) {
            console.error("AI Analysis failed", error);
          } finally {
            setIsAnalyzing(false);
          }
        } else {
          setMetadata(null);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handlePost = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append('video', file); // API expects 'video' key for both types currently
      formData.append('caption', caption || (fileType === 'image' ? 'New Photo' : 'New Video'));
      formData.append('userId', 'user_' + Math.floor(Math.random() * 10000));

      setUploadProgress(30);

      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setUploadProgress(100);
      toast({
        title: "Success!",
        description: "Your snap has been posted.",
      });
      
      setTimeout(() => router.push("/"), 1000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Something went wrong while uploading.",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl border-x border-white/5 pb-24">
      <header className="p-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-headline font-bold">New Snap</h1>
        <Button 
          disabled={!file || isUploading || isAnalyzing} 
          onClick={handlePost}
          className="bg-primary text-primary-foreground font-bold h-9 px-6 rounded-full"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
        </Button>
      </header>

      <div className="p-5 space-y-6">
        {!preview ? (
          <div className="aspect-[4/5] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-4 bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Upload className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Upload Video or Photo</p>
              <p className="text-[11px] text-muted-foreground mt-1 px-10 text-center">Share your moments with the world</p>
            </div>
            
            <div className="flex flex-col space-y-3 w-full px-10 pt-4">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="video/*,image/*" 
                  onChange={handleFileChange} 
                />
                <div className="w-full py-3 bg-primary text-primary-foreground text-center rounded-full text-xs font-bold transition-all shadow-lg shadow-primary/20 flex items-center justify-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Choose Media</span>
                </div>
              </label>
              
              <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold">Or Capture</p>

              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="file" className="hidden" accept="video/*" capture="environment" onChange={handleFileChange} />
                  <div className="py-3 bg-white/5 hover:bg-white/10 text-center rounded-2xl text-[10px] font-bold transition-all border border-white/10 flex flex-col items-center space-y-1">
                    <Video className="w-4 h-4 text-accent" />
                    <span>Video</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                  <div className="py-3 bg-white/5 hover:bg-white/10 text-center rounded-2xl text-[10px] font-bold transition-all border border-white/10 flex flex-col items-center space-y-1">
                    <Camera className="w-4 h-4 text-primary" />
                    <span>Photo</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group bg-black">
              {fileType === 'video' ? (
                <video src={preview} className="w-full h-full object-cover" controls muted />
              ) : (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              )}
              
              {!isUploading && (
                <button 
                  onClick={() => { setPreview(null); setFile(null); setMetadata(null); }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-white tracking-widest uppercase">Smart Vision Analyzing...</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white/40 mb-1">
                <Type className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Caption</span>
              </div>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a catchy caption..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none h-24"
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Uploading to cloud...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1 bg-white/5" />
              </div>
            )}

            {metadata && (
              <div className="space-y-4 animate-in fade-in duration-700">
                <div className="flex items-center space-x-2 text-accent">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Suggestions</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map(tag => (
                    <div key={tag} className="flex items-center space-x-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full">
                      <Tag className="w-3 h-3 text-accent" />
                      <span className="text-[10px] font-bold text-accent">#{tag.toLowerCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
