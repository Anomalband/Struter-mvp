from gtts import gTTS
import os

class VoiceAgent:
    def __init__(self):
        # Kayıtların tutulacağı klasörü kontrol et
        self.storage_path = "storage/audio"
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)

    def generate_audio(self, text, filename, lang='tr'):
        """
        Metni ücretsiz Google altyapısıyla sese dönüştürür.
        lang: 'tr' (Türkçe), 'en' (İngilizce) vb.
        """
        try:
            output_path = os.path.join(self.storage_path, f"{filename}.mp3")
            
            # gTTS motorunu çalıştır
            tts = gTTS(text=text, lang=lang, slow=False)
            tts.save(output_path)
            
            print(f"Ses dosyası oluşturuldu: {output_path}")
            return output_path
        except Exception as e:
            print(f"Seslendirme hatası: {e}")
            return None