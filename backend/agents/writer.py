import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class WriterAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash-lite') 

    def generate_script(self, user_prompt, duration_seconds):
        prompt = f"""
        Görevin: {user_prompt} hakkında dikey (9:16) bir video senaryosu yazmak.
        Süre: {duration_seconds} saniye.
        
        KRİTİK TALİMATLAR:
        1. 'visual_query' değerleri Pexels'te aratılacaktır. Sadece konuyu anlatan İNGİLİZCE anahtar kelimeler yaz.
        2. Örnek: Eğer konu arabaysa 'luxury car driving' yaz, gidip 'woman holding flower' yazma!
        "Müşteri promptu ile görsel uyumu %100 olmalı. Eğer konu Heavy Metal ise, visual_query içine mutlaka 'heavy metal', 'rock concert', 'electric guitar' gibi anahtar kelimeleri her sahnede ekle. Sadece 'audience' yazma, 'heavy metal concert audience' yaz."
        3. Sahne sürelerini toplam {duration_seconds} saniyeye tam eşitle.
        4.Toplam metin uzunluğu en fazla {int(duration_seconds * 2.5)} kelime olmalı.

        JSON FORMATINDA CEVAP VER:
        {{
          "segments": [
            {{ "text": "Metin", "duration": 5.0, "visual_query": "specific car interior shot" }}
          ]
        }}
        """
        response = self.model.generate_content(prompt)
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
    