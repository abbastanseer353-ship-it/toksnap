
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image as ImageIcon, X, Zap, Loader2, Sparkles, Tag, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateImageMetadata } from "@/ai/flows/generate-image-metadata";
import { cn } from "@/lib/utils";

export default function UploadPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [metadata, setMetadata] = useState<{ altText: string; tags: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setSelectedImage(dataUri);
        
        // Start AI Analysis
        setIsProcessing(true);
        setUploadProgress(20);
        try {
          const result = await generateImageMetadata({ photoDataUri: dataUri });
          setMetadata(result);
          setUploadProgress(100);
        } catch (error) {
          console.error("AI Analysis failed", error);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    // Simulating final upload
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => router.push("/"), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl border-x border-white/5 pb-24">
      <header className="p-5 flex items-center justify-between border-b border-white/5 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-headline font-bold">New Snap</h1>
        <Button 
          disabled={!selectedImage || isProcessing} 
          onClick={handlePost}
          className="bg-primary text-primary-foreground font-bold h-9 px-6 rounded-full"
        >
          Post
        </Button>
      </header>

      <div className="p-5 space-y-6">
        {!selectedImage ? (
          <div className="aspect-[4/5] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-4 bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">Take a Snap</p>
              <p className="text-[11px] text-muted-foreground mt-1">Capture the moment or pick from gallery</p>
            </div>
            
            <div className="flex flex-col space-y-3 w-full px-10">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment" 
                  onChange={handleFileChange} 
                />
                <div className="w-full py-3 bg-primary text-primary-foreground text-center rounded-full text-xs font-bold transition-all shadow-lg shadow-primary/20">
                  Open Camera
                </div>
              </label>
              
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <div className="w-full py-3 bg-white/5 hover:bg-white/10 text-center rounded-full text-xs font-bold transition-all border border-white/10">
                  Choose from Gallery
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group">
              <img src={selectedImage} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
              
              {isProcessing && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-white tracking-widest uppercase">Smart Vision Analyzing...</p>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Processing vibe...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1 bg-white/5" />
              </div>
            )}

            {metadata && (
              <div className="space-y-4 animate-in fade-in duration-700 delay-300">
                <div className="flex items-center space-x-2 text-accent">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-wider">Smart Suggestions</span>
                </div>
                
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-sm font-medium leading-relaxed italic">
                    "{metadata.altText}"
                  </p>
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
