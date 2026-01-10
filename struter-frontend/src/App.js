import './index.css';
import React, { useState } from 'react';
import Wizard from './components/Wizard';
import VideoList from './components/VideoList';
import Header from './components/Header';
import LiveTerminal from './components/LiveTerminal';

console.log("ENV OBJECT:", process.env);
console.log("API BASE:", process.env.REACT_APP_API_BASE);


const App = () => {
  const [logs, setLogs] = useState([{ id: 1, text: "Sistem hazır.", type: "system" }]);

  const addLog = (text, type = "info") => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev]);
  };

const handleStart = async (formData) => {
  const API_BASE = process.env.REACT_APP_API_BASE;

  setLogs([{ id: Date.now(), text: `${formData.duration} saniyelik süreç başlatıldı...`, type: "info" }]);

  try {
    const response = await fetch(`${API_BASE}/generate-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });


      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; // Gelen verileri burada biriktirip satır satır işleyeceğiz

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Yeni gelen parçayı decode et ve buffer'a ekle
        buffer += decoder.decode(value, { stream: true });
        
        // Veriyi SSE formatına göre (çift alt satır) parçala
        let parts = buffer.split('\n\n');
        
        // Son parça tamamlanmamış olabilir, onu buffer'da tut
        buffer = parts.pop();

        for (const part of parts) {
          const line = part.trim();
          if (line.startsWith('data: ')) {
            try {
              const jsonString = line.replace('data: ', '');
              const data = JSON.parse(jsonString);
              
              // Sadece yeni gelen bu spesifik mesajı loga ekle
              addLog(data.message, data.type);
              
              // Başarı kontrolü
              if (data.type === "success" && data.message.includes("Tamamlandı")) {
                 window.dispatchEvent(new Event('videoGenerated'));
              }
            } catch (e) {
              console.error("JSON Ayrıştırma Hatası:", e);
            }
          }
        }
      }
    } catch (error) {
      addLog("BAĞLANTI HATASI: Sunucu yanıt vermiyor.", "error");
    }
};

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 p-4 md:p-6 lg:p-10 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header - Üst Bilgi */}
        <Header credits={1000} youtubeStatus="connected" />
        
        {/* Ana Layout: Mobilde Tek Kolon, Masaüstünde 12 Kolon Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          
          {/* Sol Taraf: Kontroller ve Liste (Geniş ekranda 8/12 yer kaplar) */}
          <div className="col-span-1 lg:col-span-8 space-y-8">
            
            {/* Sihirbaz Kartı */}
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl">
              <div className="px-6 py-5 border-b border-zinc-800/50">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Video Oluşturma Motoru</h2>
              </div>
              <div className="p-6">
                <Wizard onStart={handleStart} addLog={addLog} />
              </div>
            </div>

            {/* Galeri Kartı */}
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl">
              <div className="px-6 py-5 border-b border-zinc-800/50">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Önceki Çalışmalar</h2>
              </div>
              <div className="p-6">
                <VideoList />
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Terminal (Mobilde en alta düşer, sabitlenmez) */}
          <div className="col-span-1 lg:col-span-4 h-full">
            <div className="bg-[#121214] border border-zinc-800 rounded-3xl shadow-2xl h-full min-h-[400px] flex flex-col">
              <div className="px-6 py-5 border-b border-zinc-800/50 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-500">Canlı Sistem Logları</h2>
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
                </div>
              </div>
              {/* Terminal içeriğinin kartın içine yayılması sağlanır */}
              <div className="flex-1">
                <LiveTerminal logs={logs} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;