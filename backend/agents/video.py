import os
import requests
from dotenv import load_dotenv

load_dotenv()

class VideoAgent:
    def __init__(self):
        self.api_key = os.getenv("PEXELS_API_KEY")
        self.base_url = "https://api.pexels.com/videos/search"

    def download_video(self, query, filename):
        headers = {"Authorization": self.api_key}
        # orientation=portrait parametresi ile sadece dikey videoları istiyoruz
        params = {
            "query": query,
            "per_page": 1,
            "orientation": "portrait", 
            "size": "medium"
        }
        
        try:
            response = requests.get(self.base_url, headers=headers, params=params)
            data = response.json()
            
            if data['videos']:
                # En iyi kalite dikey videonun linkini al
                video_url = data['videos'][0]['video_files'][0]['link']
                v_res = requests.get(video_url)
                
                path = os.path.join("storage", "videos", f"{filename}.mp4")
                with open(path, "wb") as f:
                    f.write(v_res.content)
                return path
            else:
                # Eğer dikey video bulunamazsa genel aramaya düş ama uyar
                print(f"UYARI: {query} için dikey video bulunamadı, genel aranıyor...")
                return self.fallback_download(query, filename)
        except Exception as e:
            print(f"Video indirme hatası: {e}")
            return None