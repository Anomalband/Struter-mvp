// frontend/src/components/VideoModal.jsx
import React from 'react';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#121214] border border-zinc-800 w-full max-w-4xl rounded-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* SOL: Video Oynatıcı (9:16 Formatı) */}
        <div className="flex-[1.2] bg-black flex items-center justify-center p-4 border-r border-zinc-800">
          <div className="relative aspect-[9/16] h-full max-h-[70vh] shadow-2xl shadow-blue-500/10 border border-zinc-800 rounded-lg overflow-hidden">
            <video 
              src={video.url}
              controls
              playsInline
              muted
              autoPlay
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* SAĞ: Teknik Detaylar & İşlemler */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{video.title}</h2>
                <p className="text-zinc-500 text-sm mt-1">{video.date} tarihinde üretildi</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
              </button>
            </div>

            {/* Struter'ın Beyni: Teknik Karne (MVP Data) */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sistem Raporu</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <span className="block text-[10px] text-zinc-500 uppercase">Gerçek Süre</span>
                  <span className="text-sm font-mono text-emerald-400">{video.duration}</span>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <span className="block text-[10px] text-zinc-500 uppercase">Platform</span>
                  <span className="text-sm font-mono text-blue-400">{video.platform}</span>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <span className="block text-[10px] text-zinc-500 uppercase">Eşleşme Skoru</span>
                  <span className="text-sm font-mono text-zinc-300">%98.4</span>
                </div>
                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                  <span className="block text-[10px] text-zinc-500 uppercase">Ses Kimliği</span>
                  <span className="text-sm font-mono text-zinc-300">Onyx</span>
                </div>
              </div>
            </div>
          </div>

          {/* Aksiyon Butonları */}
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"/></svg>
              YOUTUBE'DA YAYINLA
            </button>
            <div className="flex gap-3">
              <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm font-semibold transition-all">
                İNDİR (MP4)
              </button>
              <button className="flex-1 border border-red-900/30 text-red-500 hover:bg-red-500/10 py-3 rounded-xl text-sm font-semibold transition-all">
                SİL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;