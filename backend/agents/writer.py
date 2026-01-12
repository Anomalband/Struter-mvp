import os
import json
from google import genai  # Yeni SDK
from dotenv import load_dotenv

load_dotenv()

class WriterAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        # Yeni SDK'da konfigürasyon Client üzerinden yapılır
        self.client = genai.Client(api_key=api_key)
        self.model_id = 'gemini-2.0-flash' # 2.5 diye bir sürüm henüz yok, en günceli 2.0 flash

    def generate_script(self, user_prompt, duration_seconds):
        prompt = f"""
        Görevin: {user_prompt} hakkında dikey (9:16) bir video senaryosu yazmak.
        Süre: {duration_seconds} saniye.
        
        KRİTİK TALİMATLAR:
        1. 'visual_query' değerleri Pexels'te aratılacaktır. Sadece konuyu anlatan İNGİLİZCE anahtar kelimeler yaz.
        2. Sahne sürelerini toplam {duration_seconds} saniyeye tam eşitle.
        3. Toplam metin uzunluğu en fazla {int(duration_seconds * 2.5)} kelime olmalı.

        JSON FORMATINDA CEVAP VER:
        {{
          "segments": [
            {{ "text": "Metin", "duration": 5.0, "visual_query": "specific car interior shot" }}
          ]
        }}
        """
        
        # Yeni SDK kullanım şekli:
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=prompt
        )
        
        # Markdown bloklarını temizleme (Yeni SDK'da response.text doğrudan gelir)
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        
        try:
            return json.loads(clean_text)
        except json.JSONDecodeError:
            # Eğer model bazen baştaki/sondaki ekstra metinleri silmezse diye güvenlik önlemi
            start_idx = clean_text.find('{')
            end_idx = clean_text.rfind('}') + 1
            return json.loads(clean_text[start_idx:end_idx])