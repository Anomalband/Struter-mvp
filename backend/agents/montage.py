from moviepy import VideoFileClip, AudioFileClip, concatenate_videoclips, vfx
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
                    
                    # 1. Önce Boyutlandır ve Kırp (CPU yormamak için süreden önce yap)
                    video = video.resized(height=target_h)
                    video = video.cropped(x_center=video.w/2, width=target_w, height=target_h)
                    
                    audio_dur = audio.duration
                    
                    # 🔴 KRİTİK DÜZELTME BURASI:
                    if video.duration < audio_dur:
                        # Video sesten kısaysa: Videoyu sesin süresine "loop" yap (döngüye sok)
                        # Not: v2.0'da loop fonksiyonu vfx altındadır
                        video = video.with_effects([vfx.Loop(n=None, duration=audio_dur)])
                    else:
                        # Video sesten uzunsa: Sese göre kes
                        video = video.subclipped(0, audio_dur)
                    
                    video = video.with_audio(audio)
                    clips.append(video)

            if clips:
                final = concatenate_videoclips(clips, method="compose")
                
                if final.duration > total_target_duration:
                    final = final.subclipped(0, total_target_duration)
                
                os.makedirs(os.path.join("storage", "outputs"), exist_ok=True)
                out_path = os.path.join("storage", "outputs", output_name)
                
                # Render (Linux) için temp dosyası bazen sorun çıkarır, 
                # o yüzden temp path'i mutlak yol yapabiliriz ya da varsayılanda bırakabiliriz.
                final.write_videofile(
                    out_path, 
                    fps=24, 
                    codec="libx264", 
                    audio_codec="aac", 
                    remove_temp=True,
                    logger=None 
                )
                
                for c in clips: c.close()
                if 'audio' in locals(): audio.close() # Audio nesnelerini de kapat
                final.close()
                
                return out_path
                
        except Exception as e:
            print(f"Montaj Hatası: {e}")
        return None