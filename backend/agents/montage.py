from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips
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
                    
                    # --- HIZLANDIRMA/YAVAŞLATMA YAPMAYAN MANTIK ---
                    # Videoyu orijinal hızında, sesin süresi kadar kırpıyoruz (subclip)
                    # Eğer video sesten kısaysa, videonun son karesini dondurmak yerine 
                    # videoyu en baştan itibaren ses süresi kadar alıyoruz.
                    dur = audio.duration
                    
                    # Video boyutu ayarlama (Hızla oynamaz)
                    video = video.resize(height=target_h)
                    video = video.crop(x_center=video.w/2, width=target_w, height=target_h)
                    
                    # Sadece kesme işlemi: 0'dan sesin bittiği yere kadar.
                    # Eğer video sesten kısaysa loop yapar, uzunsa keser (hız değişmez).
                    if video.duration < dur:
                        video = video.loop(duration=dur)
                    else:
                        video = video.subclip(0, dur)
                    
                    video = video.set_audio(audio)
                    clips.append(video)

            if clips:
                # Klipleri birleştir
                final = concatenate_videoclips(clips, method="compose")
                
                # --- KESİN SÜRE KONTROLÜ ---
                # 32 saniye çıkmaması için tam burada "hard cut" yapıyoruz.
                if final.duration > total_target_duration:
                    final = final.subclip(0, total_target_duration)
                
                out_path = os.path.join("storage", "outputs", output_name)
                # write_videofile sırasında logger=None diyerek çıktı kalabalığını önleyebilirsin
                final.write_videofile(out_path, fps=24, codec="libx264", audio_codec="aac", temp_audiofile="temp-audio.m4a", remove_temp=True)
                
                for c in clips: c.close()
                return out_path
                
        except Exception as e:
            print(f"Hata: {e}")
        return None