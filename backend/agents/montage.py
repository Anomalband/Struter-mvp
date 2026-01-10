from moviepy import VideoFileClip, AudioFileClip, concatenate_videoclips # .editor kısmı kaldırıldı
import os

class MontageAgent:
    def create_final_video(self, segments, output_name, total_target_duration):
        clips = []
        target_w, target_h = 1080, 1920
        total_target_duration = float(total_target_duration)

        try:
            for i, segment in enumerate(segments):
                v_path = f"storage/videos/clip_{i}.mp4"
                a_path = f"storage/audio/speech_{i}.mp3"
                
                if os.path.exists(v_path) and os.path.exists(a_path):
                    audio = AudioFileClip(a_path)
                    video = VideoFileClip(v_path)
                    
                    # Video boyutu ayarlama (Resize yeni versiyonda da aynı çalışır)
                    video = video.resized(height=target_h) # resize yerine bazen resized istenebilir
                    video = video.cropped(x_center=video.w/2, width=target_w, height=target_h)
                    
                    dur = audio.duration
                    
                    # Video süresi ayarlama
                    if video.duration < dur:
                        # MoviePy 2.0+ için loop kullanımı bazen değişebilir, 
                        # en garantisi subclip/set_duration mantığıdır.
                        video = video.with_duration(dur) 
                    else:
                        video = video.subclipped(0, dur) # subclip -> subclipped (v2.0 standardı)
                    
                    video = video.with_audio(audio) # set_audio -> with_audio (v2.0 standardı)
                    clips.append(video)

            if clips:
                # Klipleri birleştir
                final = concatenate_videoclips(clips, method="compose")
                
                # Kesin süre kontrolü
                if final.duration > total_target_duration:
                    final = final.subclipped(0, total_target_duration)
                
                # Klasör kontrolü (Render'da hata almamak için)
                os.makedirs(os.path.join("storage", "outputs"), exist_ok=True)
                out_path = os.path.join("storage", "outputs", output_name)
                
                # Yazma işlemi
                final.write_videofile(
                    out_path, 
                    fps=24, 
                    codec="libx264", 
                    audio_codec="aac", 
                    temp_audiofile="temp-audio.m4a", 
                    remove_temp=True,
                    logger=None # Log kalabalığını önler
                )
                
                # Belleği temizle (Render'da RAM patlamaması için çok önemli)
                for c in clips: c.close()
                final.close()
                
                return out_path
                
        except Exception as e:
            print(f"Montaj Hatası: {e}")
        return None