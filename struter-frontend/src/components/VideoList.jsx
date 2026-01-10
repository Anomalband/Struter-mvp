import React, { useState, useEffect, useCallback } from 'react';

// BURASI KRİTİK: Localtunnel linkinin doğruluğundan emin ol. 
// Sonunda "/" işareti olmasın.
const API_BASE = 'https://struter-mvp.onrender.com'; 

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Videoları çeken ana fonksiyon
  const fetchVideos = useCallback(async () => {
    try {
      console.log("VIDEO_LIST: Liste güncelleniyor...");
      const response = await fetch(`${API_BASE}/list-videos`, {
        // Localtunnel güvenlik duvarını aşmak için gerekli headerlar
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      
      const data = await response.json();
      
      // KIRLI VERI TEMIZLIĞI: 
      // Backend'den gelen link ne olursa olsun (127.0.0.1 vb.), 
      // sadece dosya adını alıp tünel linkine zorla bağlıyoruz.
      const formattedData = data.map(video => {
        const filename = video.url.split('/').pop(); 
        return {
          ...video,
          url: `${API_BASE}/outputs/${filename}`
        };
      });

      setVideos(formattedData.reverse()); 
      setLoading(false);
    } catch (error) {
      console.error("Videolar yüklenemedi:", error);
      setLoading(false);
    }
  }, []);

  // Sayfa açıldığında ve sinyal geldiğinde çalışır
  useEffect(() => {
    fetchVideos();

    const handleRefresh = () => {
      console.log("SİNYAL ALINDI: Yeni video listeye ekleniyor...");
      fetchVideos();
    };

    window.addEventListener('videoGenerated', handleRefresh);
    
    // Temizlik
    return () => window.removeEventListener('videoGenerated', handleRefresh);
  }, [fetchVideos]);

  if (loading) return <div className="text-zinc-500 text-sm">Yükleniyor...</div>;

  return (
    <div className="space-y-4">
      {videos.length === 0 ? (
        <div className="text-zinc-500 text-center py-8 border border-dashed border-zinc-800 rounded-xl">
          Henüz üretilmiş bir video bulunamadı.
        </div>
      ) : (
        videos.map((video) => (
          <div key={video.id} className="flex items-center justify-between p-4 bg-[#09090b] border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                {/* Video önizlemesi artık tünel linkiyle besleniyor */}
                <video src={video.url} className="w-full h-full object-cover" muted />
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-200">{video.title}</h3>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">HAZIR</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* İZLE butonu doğrudan tünel linkine gider */}
              <a 
                href={video.url} 
                target="_blank" 
                rel="noreferrer" 
                download
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold rounded-md"
              >
                İZLE
              </a>
              <button className="px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-[10px] font-bold rounded-md">YAYINLA</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoList;